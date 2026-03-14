const { Kafka } = require("kafkajs");
const config = require("./config");
const WebSocket = require("ws");
const { kmeans: KMeans } = require("ml-kmeans");
const admin = require('firebase-admin');

if (!admin.apps.length) {
  const serviceAccount = require('./firebase-service-account.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: config.firebase.databaseURL
  });
}

const firestoreDB = admin.firestore(); 
const realtimeDB = admin.database(); 

const wss = new WebSocket.Server({ port: 8080 });

const kafka = new Kafka({
  clientId: "motor-consumer",
  brokers: config.kafka.brokers,
});

const consumer = kafka.consumer({ groupId: config.consumer.groupId });

let dataWindow = [];

const FirebaseUtils = {
  storeScheduleResults: async (scheduleData) => {
    try {
      const result = await firestoreDB.collection('scheduleResults').add({
        schedule: scheduleData.schedule,
        metrics: scheduleData.metrics,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        mlInsights: scheduleData.mlInsights || null
      });
      
      console.info(`Schedule results stored in Firebase: ${result.id}`);
      return result.id;
    } catch (error) {
      console.error("Error storing schedule in Firebase:", error);
      return null;
    }
  },

  fetchHistoricalData: async (deviceId = null, hours = 1) => {
    try {
      const hoursAgo = new Date(Date.now() - hours * 60 * 60 * 1000);
      const motorDataRef = realtimeDB.ref('motorData');

      let query = motorDataRef.orderByChild('timestamp').startAt(hoursAgo.toISOString());

      // Add a timeout to prevent hanging if Firebase is unavailable
      const snapshot = await Promise.race([
        query.get(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Firebase DB timeout')), 3000))
      ]);
      const historicalData = [];

      if (snapshot.exists()) {
        snapshot.forEach(childSnapshot => {
          const record = childSnapshot.val();
          historicalData.push({ id: childSnapshot.key, ...record });
        });
      }
      if (deviceId) {
        return historicalData.filter(d => d.deviceId === deviceId).slice(-1000); 
      }
      
      console.info(`Fetched ${historicalData.length} historical records from Firebase`);
      return historicalData;
    } catch (error) {
      console.error("Error fetching historical data:", error.message || error);
      return [];
    }
  },

  storeAlert: async (alert) => {
    try {
      await firestoreDB.collection('alerts').add({
        ...alert,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        resolved: false
      });
    } catch (error) {
      console.error("Error storing alert:", error);
    }
  }
};

const MLUtils = {
  normalizeFeatures: (dataPoints) => {
    if (dataPoints.length === 0) return dataPoints;
    
    const features = ['current', 'temperature', 'pressure'];
    const stats = features.map(feature => {
      const values = dataPoints.map(point => point[features.indexOf(feature)]);
      return {
        min: Math.min(...values),
        max: Math.max(...values),
        mean: values.reduce((sum, val) => sum + val, 0) / values.length
      };
    });
    
    return dataPoints.map(point => 
      point.map((value, idx) => {
        const { min, max } = stats[idx];
        return max === min ? 0 : (value - min) / (max - min);
      })
    );
  },

  calculateSilhouetteScore: (dataPoints, clusters, centroids) => {
    if (clusters.length < 2) return 0;
    
    let totalScore = 0;
    
    clusters.forEach((cluster, pointIdx) => {
      const point = dataPoints[pointIdx];
      
      const sameClusterPoints = dataPoints.filter((_, idx) => clusters[idx] === cluster && idx !== pointIdx);
      const aDistance = sameClusterPoints.length > 0 
        ? sameClusterPoints.reduce((sum, p) => sum + MLUtils.euclideanDistance(point, p), 0) / sameClusterPoints.length
        : 0;
      
      let minInterClusterDistance = Infinity;
      centroids.forEach((centroid, centroidIdx) => {
        if (centroidIdx !== cluster) {
          const otherClusterPoints = dataPoints.filter((_, idx) => clusters[idx] === centroidIdx);
          if (otherClusterPoints.length > 0) {
            const bDistance = otherClusterPoints.reduce((sum, p) => sum + MLUtils.euclideanDistance(point, p), 0) / otherClusterPoints.length;
            minInterClusterDistance = Math.min(minInterClusterDistance, bDistance);
          }
        }
      });
      
      const silhouette = minInterClusterDistance === Infinity ? 0 : 
        (minInterClusterDistance - aDistance) / Math.max(aDistance, minInterClusterDistance);
      
      totalScore += silhouette;
    });
    
    return totalScore / clusters.length;
  },

  euclideanDistance: (point1, point2) => {
    return Math.sqrt(point1.reduce((sum, val, idx) => sum + Math.pow(val - point2[idx], 2), 0));
  },

  detectAnomalies: (deviceAverages) => {
    const values = Object.values(deviceAverages);
    if (values.length < 3) return [];
    
    const anomalies = [];
    
    ['avgCurrent', 'avgTemp', 'avgPressure'].forEach(metric => {
      const metricValues = values.map(device => device[metric]);
      const mean = metricValues.reduce((sum, val) => sum + val, 0) / metricValues.length;
      const stdDev = Math.sqrt(metricValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / metricValues.length);
      
      Object.keys(deviceAverages).forEach(deviceId => {
        const value = deviceAverages[deviceId][metric];
        const zScore = stdDev > 0 ? Math.abs((value - mean) / stdDev) : 0;
        
        if (zScore > 2.5) {
          anomalies.push({
            deviceId,
            metric,
            value,
            zScore,
            severity: zScore > 3 ? 'HIGH' : 'MEDIUM'
          });
        }
      });
    });
    
    return anomalies;
  },

  findOptimalClusters: (dataPoints, maxClusters = 5) => {
    if (dataPoints.length < 2) return 1;
    
    const wcss = [];
    const maxK = Math.min(maxClusters, Math.floor(dataPoints.length / 2));
    
    for (let k = 1; k <= maxK; k++) {
      try {
        const { clusters, centroids } = KMeans(dataPoints, k, {
          initialization: 'kmeans++',
          maxIterations: 100
        });
        
        let totalWCSS = 0;
        clusters.forEach((cluster, pointIdx) => {
          const point = dataPoints[pointIdx];
          const centroid = centroids[cluster];
          totalWCSS += MLUtils.euclideanDistance(point, centroid);
        });
        
        wcss.push(totalWCSS);
      } catch (error) {
        wcss.push(Infinity);
      }
    }
    
    let optimalK = 1;
    let maxImprovement = 0;
    
    for (let i = 1; i < wcss.length - 1; i++) {
      const improvement = wcss[i-1] - wcss[i];
      const nextImprovement = wcss[i] - wcss[i+1];
      
      if (improvement > maxImprovement && improvement > nextImprovement * 1.5) {
        maxImprovement = improvement;
        optimalK = i + 1;
      }
    }
    
    return Math.min(optimalK, 3);
  }
};

const getScheduleFromModel = async (deviceAverages) => {
  const schedule = {};
  console.info("\nRunning Enhanced K-Means clustering with Firebase integration...");

  const historicalData = await FirebaseUtils.fetchHistoricalData(null, 1);
  
  const dataPoints = [];
  const deviceIds = Object.keys(deviceAverages);

  deviceIds.forEach((deviceId) => {
    const { avgCurrent, avgTemp, avgPressure } = deviceAverages[deviceId];
    
    if (isNaN(avgCurrent) || isNaN(avgTemp) || isNaN(avgPressure)) {
      console.warn(`Invalid data for device ${deviceId}, skipping`);
      return;
    }
    
    dataPoints.push([avgCurrent, avgTemp, avgPressure]);
  });

  if (dataPoints.length === 0) {
    console.warn("No valid data points available for clustering");
    return { schedule, mlInsights: null };
  }

  if (dataPoints.length < 3) {
    console.info("Insufficient data for clustering, using rule-based fallback");
    const ruleBasedSchedule = getRuleBasedSchedule(deviceAverages);
    return { schedule: ruleBasedSchedule, mlInsights: { method: 'rule-based', reason: 'insufficient-data' } };
  }

  const anomalies = MLUtils.detectAnomalies(deviceAverages);
  if (anomalies.length > 0) {
    console.info("Anomalies detected:", anomalies.map(a => `${a.deviceId}:${a.metric}(${a.severity})`).join(', '));
    
    for (const anomaly of anomalies.filter(a => a.severity === 'HIGH')) {
      await FirebaseUtils.storeAlert({
        type: 'ANOMALY_DETECTED',
        deviceId: anomaly.deviceId,
        metric: anomaly.metric,
        value: anomaly.value,
        zScore: anomaly.zScore,
        severity: anomaly.severity
      });
    }
  }

  try {
    const normalizedPoints = MLUtils.normalizeFeatures(dataPoints);
    const optimalClusters = MLUtils.findOptimalClusters(normalizedPoints);
    
    console.info(`Optimal cluster count determined: ${optimalClusters}`);
    
    const { clusters, centroids } = KMeans(normalizedPoints, optimalClusters, {
      initialization: 'kmeans++',
      maxIterations: 300,
      tolerance: 1e-6
    });

    const silhouetteScore = MLUtils.calculateSilhouetteScore(normalizedPoints, clusters, centroids);
    console.info(`Clustering quality (Silhouette Score): ${silhouetteScore.toFixed(3)}`);
    
    if (silhouetteScore < 0.1 && optimalClusters > 1) {
      console.warn("Poor clustering quality detected, using rule-based fallback");
      const ruleBasedSchedule = getRuleBasedSchedule(deviceAverages);
      return { schedule: ruleBasedSchedule, mlInsights: { method: 'rule-based', reason: 'poor-quality' } };
    }

    const originalCentroids = centroids.map(centroid => {
      const avgCurrentRange = [5, 25];
      const avgTempRange = [20, 100];   
      const avgPressureRange = [900, 1200];
      
      return [
        centroid[0] * (avgCurrentRange[1] - avgCurrentRange[0]) + avgCurrentRange[0],
        centroid[1] * (avgTempRange[1] - avgTempRange[0]) + avgTempRange[0],
        centroid[2] * (avgPressureRange[1] - avgPressureRange[0]) + avgPressureRange[0]
      ];
    });

    const clusterRanking = originalCentroids
      .map((centroid, idx) => ({ 
        idx, 
        current: centroid[0],
        temp: centroid[1], 
        pressure: centroid[2],
        deviceCount: clusters.filter(c => c === idx).length
      }))
      .sort((a, b) => a.current - b.current);

    const clusterToSlot = {};
    if (optimalClusters >= 3) {
      clusterToSlot[clusterRanking[0].idx] = "Morning slot (Light Load)";
      clusterToSlot[clusterRanking[1].idx] = "Night slot (Medium Load)";
      clusterToSlot[clusterRanking[2].idx] = "Evening slot (Heavy Load)";
    } else if (optimalClusters === 2) {
      const totalDevices = deviceIds.length;
      const lightLoadThreshold = totalDevices * 0.6;
      
      if (clusterRanking[0].deviceCount > lightLoadThreshold) {
        clusterToSlot[clusterRanking[0].idx] = "Distributed Load Operations";
        clusterToSlot[clusterRanking[1].idx] = "Peak Load Operations";
      } else {
        clusterToSlot[clusterRanking[0].idx] = "Low Load Operations";
        clusterToSlot[clusterRanking[1].idx] = "High Load Operations";
      }
    } else {
      clusterToSlot[clusterRanking[0].idx] = "Standard Operations";
    }

    deviceIds.forEach((deviceId, i) => {
      const { avgCurrent, avgTemp, avgPressure } = deviceAverages[deviceId];

      const maintenanceNeeded = avgCurrent > 22.0 || avgTemp > 90.0 || 
                               avgPressure < 950 || avgPressure > 1100;
      
      const highRiskConditions = avgCurrent > 20.0 || avgTemp > 85.0 || 
                                avgPressure < 960 || avgPressure > 1090;
      
      const isAnomaly = anomalies.some(anomaly => anomaly.deviceId === deviceId && anomaly.severity === 'HIGH');
      
      if (maintenanceNeeded || isAnomaly) {
        schedule[deviceId] = "Excluded (Maintenance needed)";
      } else if (highRiskConditions) {
        schedule[deviceId] = "Monitoring Required (Reduced Load)";
      } else {
        const clusterId = clusters[i];
        schedule[deviceId] = clusterToSlot[clusterId] || "Standard Operations";
      }
    });

    console.info("\nAdvanced Cluster Analysis:");
    clusterRanking.forEach((cluster, idx) => {
      console.info(`Cluster ${idx + 1}: Current=${cluster.current.toFixed(2)}A, Temp=${cluster.temp.toFixed(1)}°C, Pressure=${cluster.pressure.toFixed(0)}hPa, Devices=${cluster.deviceCount}`);
    });
    
    const mlInsights = {
      method: 'k-means',
      quality: silhouetteScore,
      anomalies: anomalies.length,
      optimalK: optimalClusters,
      historicalDataPoints: historicalData.length
    };

    console.info(`Clustering Insights: Quality=${silhouetteScore.toFixed(3)}, Anomalies=${anomalies.length}, OptimalK=${optimalClusters}, Historical=${historicalData.length}`);

    return { schedule, mlInsights };

  } catch (error) {
    console.error("Enhanced K-Means clustering failed, using rule-based fallback:", error.message);
    const ruleBasedSchedule = getRuleBasedSchedule(deviceAverages);
    return { schedule: ruleBasedSchedule, mlInsights: { method: 'rule-based', reason: 'clustering-error' } };
  }
};

const getRuleBasedSchedule = (deviceAverages) => {
  const schedule = {};
  console.info("Using rule-based scheduling fallback...");

  for (const deviceId in deviceAverages) {
    const { avgCurrent, avgTemp, avgPressure } = deviceAverages[deviceId];

    if (avgCurrent > 22.0 || avgTemp > 90.0 || avgPressure < 950 || avgPressure > 1100) {
      schedule[deviceId] = "Excluded (Maintenance needed)";
    } else if (avgCurrent >= 15.0) {
      schedule[deviceId] = "Evening slot (Heavy Load)";
    } else if (avgCurrent >= 10.0) {
      schedule[deviceId] = "Night slot (Medium Load)";
    } else {
      schedule[deviceId] = "Morning slot (Light Load)";
    }
  }

  return schedule;
};

const consumeMotorData = async () => {
  try {
    await consumer.connect();
    console.info("Consumer connected to Kafka");
    await consumer.subscribe({ topic: config.kafka.topic, fromBeginning: true });

    consumer.run({
      eachMessage: async ({ message }) => {
        const data = JSON.parse(message.value.toString());
        const { deviceId, current, temperature, pressure } = data;

        dataWindow.push({ ...data, receivedAt: Date.now() });

        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ 
              type: 'realtime',
              deviceId,
              data: { current, temperature, pressure },
              timestamp: Date.now()
            }));
          }
        });
      },
    });
  } catch (error) {
    console.error("Error starting consumer:", error);
    process.exit(1);
  }
};

setInterval(async () => {
  const tenSecondsAgo = Date.now() - 10 * 1000;
  const recentData = dataWindow.filter((d) => d.receivedAt > tenSecondsAgo);

  if (recentData.length === 0) {
    console.info("\nNo data in the last 10 seconds to generate schedule.");
    return;
  }

  const deviceData = {};
  recentData.forEach((d) => {
    if (!deviceData[d.deviceId]) {
      deviceData[d.deviceId] = { 
        totalCurrent: 0, 
        totalTemp: 0, 
        totalPressure: 0, 
        count: 0 
      };
    }
    deviceData[d.deviceId].totalCurrent += parseFloat(d.current);
    deviceData[d.deviceId].totalTemp += parseFloat(d.temperature);
    deviceData[d.deviceId].totalPressure += parseFloat(d.pressure);
    deviceData[d.deviceId].count++;
  });

  const deviceAverages = {};
  for (const deviceId in deviceData) {
    const dev = deviceData[deviceId];
    deviceAverages[deviceId] = {
      avgCurrent: dev.totalCurrent / dev.count,
      avgTemp: dev.totalTemp / dev.count,
      avgPressure: dev.totalPressure / dev.count,
    };
  }

  const { schedule: newSchedule, mlInsights } = await getScheduleFromModel(deviceAverages);

  const scheduleData = {
    schedule: newSchedule,
    metrics: deviceAverages,
    mlInsights
  };
  
  await FirebaseUtils.storeScheduleResults(scheduleData);

  console.info("\nNew 10-second Motor Operational Schedule Generated:");
  console.log(newSchedule);

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ 
        type: 'schedule',
        metrics: deviceAverages, 
        schedule: newSchedule,
        mlInsights,
        timestamp: Date.now(),
        dataPoints: recentData.length
      }));
    }
  });

  const oneMinuteAgo = Date.now() - 60 * 1000;
  dataWindow = dataWindow.filter((d) => d.receivedAt > oneMinuteAgo);

}, 10 * 1000);

wss.on('connection', (ws) => {
  console.info("New WebSocket client connected");
  
  ws.on('close', () => {
    console.info("WebSocket client disconnected");
  });

  ws.send(JSON.stringify({
    type: 'welcome',
    message: 'Connected to IoT Motor Monitoring System with Firebase Integration',
    timestamp: Date.now()
  }));
});

const gracefulShutdown = async () => {
  console.info("\nConsumer is shutting down...");
  try {
    await consumer.disconnect();
    console.info("Consumer disconnected from Kafka");
    
    wss.close();
    console.info("WebSocket server closed");
    
    console.info("Graceful shutdown completed");
  } catch (error) {
    console.error("Error during graceful shutdown:", error);
  } finally {
    process.exit(0);
  }
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  gracefulShutdown();
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown();
});

console.info("Starting Enhanced IoT Motor Monitoring Consumer with Firebase Integration...");
console.info("WebSocket server listening on port 8080");

consumeMotorData();
