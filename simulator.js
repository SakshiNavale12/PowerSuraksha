const TOTAL_DEVICES = 100;


function generateSensorData(deviceId) {
  return {
    deviceId,
    sensorTemperature: Math.floor(Math.random() * 70) + 40, // 10 - 70 °C
    sensorPressure: Math.floor(Math.random() * 6) + 3,   // 950 - 1000 hPa
    sensorCurrent: Math.floor(Math.random() * 11) + 8,      // 1 - 10 Amp
    timestamp: new Date().toISOString()
  };
}


setInterval(() => {
  const allData = [];
  for (let i = 1; i <= TOTAL_DEVICES; i++) {
    const data = generateSensorData(i);
    allData.push(data);
  }

  console.log("Batch of simulated sensor data:", allData, "records");
  // In next steps, you’ll send `allData` to Kafka / API instead of console.log
}, 1000);
