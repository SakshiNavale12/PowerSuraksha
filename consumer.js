const { Kafka } = require("kafkajs");
const config = require("./config");

const kafka = new Kafka({
  clientId: "motor-consumer",
  brokers: config.kafka.brokers,
});

const consumer = kafka.consumer({ groupId: config.consumer.groupId });

let dataWindow = [];

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

        if (parseFloat(current) > 22.0) {
          console.warn(`CRITICAL CURRENT: Motor ${deviceId} is drawing ${current}A!`);
        }
        if (temperature > 90.0) {
          console.warn(`OVERHEATING ALERT: Motor ${deviceId} at ${temperature}°C!`);
        }
        if (pressure < 950 || pressure > 1100) {
          console.warn(`PRESSURE ALERT: Motor ${deviceId} pressure unsafe! Pressure: ${pressure} hPa`);
        }
      },
    });
  } catch (error) {
    console.error("Error starting consumer:", error);
    process.exit(1);
  }
};

const getScheduleFromModel = (deviceAverages) => {
  const schedule = {};
  console.info("\nRunning multi-parameter scheduling model on 10-minute data window...");

  for (const deviceId in deviceAverages) {
    const { avgCurrent, avgTemp, avgPressure } = deviceAverages[deviceId];

    if (avgCurrent > 20.0 || avgTemp > 85.0 || avgPressure < 950 || avgPressure > 1100) {
      schedule[deviceId] = "❌ Excluded (Maintenance needed)";
    } else if (avgCurrent >= 15.0) {
      schedule[deviceId] = "Evening slot (Heavy Load Operations)";
    } else if (avgCurrent >= 10.0) {
      schedule[deviceId] = "Night slot (Medium Load Operations)";
    } else {
      schedule[deviceId] = "Morning slot (Light Load Operations)";
    }
  }

  return schedule;
};

setInterval(() => {
  const tenMinutesAgo = Date.now() - 10 * 1000;
  const recentData = dataWindow.filter((d) => d.receivedAt > tenMinutesAgo);

  if (recentData.length === 0) {
    console.info("\nNo data in the last 10sec to generate a schedule.");
    return;
  }

  const deviceData = {};
  recentData.forEach((d) => {
    if (!deviceData[d.deviceId]) {
      deviceData[d.deviceId] = { totalCurrent: 0, totalTemp: 0, totalPressure: 0, count: 0 };
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

  const newSchedule = getScheduleFromModel(deviceAverages);

  console.info("\nNew 10sec Motor Operational Schedule Generated:");
  console.table(newSchedule);

  // Clean up old data from the window to prevent memory leak
  dataWindow = recentData;
}, 10 * 1000);

const gracefulShutdown = async () => {
  console.info("Consumer is shutting down...");
  try {
    await consumer.disconnect();
    console.info("Consumer disconnected from Kafka");
  } catch (error) {
    console.error("Error during graceful shutdown:", error);
  } finally {
    process.exit(0);
  }
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

consumeMotorData();