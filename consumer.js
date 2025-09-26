const { Kafka } = require("kafkajs");

const kafka = new Kafka({
    clientId: "motor-consumer",
    brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "motor-group" });

const dataWindow = [];

function getScheduleFromModel(deviceAverages) {
    const schedule = {};
    console.log("\n🧠 Running multi-parameter scheduling model on 10-minute data window...");

    for (const deviceId in deviceAverages) {
        const { avgCurrent, avgTemp, avgPressure } = deviceAverages[deviceId];

        // Exclusion criteria
        if (avgCurrent > 20.0 || avgTemp > 85.0 || avgPressure < 950 || avgPressure > 1100) {
            schedule[deviceId] = "❌ Excluded (Maintenance needed)";
        } 
        // Slot allocation
        else if (avgCurrent >= 15.0) {
            schedule[deviceId] = "Evening slot (Heavy Load Operations)";
        } else if (avgCurrent >= 10.0) {
            schedule[deviceId] = "Night slot (Medium Load Operations)";
        } else {
            schedule[deviceId] = "Morning slot (Light Load Operations)";
        }
    }

    return schedule;
}



async function consumeMotorData() {
    await consumer.connect();
    await consumer.subscribe({ topic: "iot-data", fromBeginning: true });

    // --- Part 1: Real-time processing for each incoming message ---
    await consumer.run({
        eachMessage: async ({ message }) => {
            const data = JSON.parse(message.value.toString());
            // REVERTED: Destructuring `pressure` instead of `vibration`
            const { deviceId, current, temperature, pressure } = data;

            dataWindow.push({ ...data, receivedAt: Date.now() });

            // --- Handle INSTANT alerts based on critical thresholds ---
            if (parseFloat(current) > 22.0) {
                console.log(`⚠️ CRITICAL CURRENT: Motor ${deviceId} is drawing ${current}A!`);
            }
            if (temperature > 90.0) {
                console.log(`🔥 OVERHEATING ALERT: Motor ${deviceId} at ${temperature}°C!`);
            }
            // REVERTED: Replaced vibration alert with the original pressure alert
            if (pressure < 950 || pressure > 1100) {
                console.log(`⚠️ PRESSURE ALERT: Motor ${deviceId} pressure unsafe! Pressure: ${pressure} hPa`);
            }
        },
    });

    // --- Part 2: Batch processing for scheduling every 10 minutes ---
setInterval(() => {
  const tenMinutesAgo = Date.now() - 10 * 60 * 1000; // 10 min window

  const recentData = dataWindow.filter(d => d.receivedAt > tenMinutesAgo);

  if (recentData.length === 0) {
    console.log("\n🕒 No data in the last 10 minutes to generate a schedule.");
    return;
  }

  const deviceData = {};
  recentData.forEach(d => {
    if (!deviceData[d.deviceId]) {
      deviceData[d.deviceId] = { totalCurrent: 0, totalTemp: 0, totalPressure: 0, count: 0 };
    }
    deviceData[d.deviceId].totalCurrent += parseFloat(d.current);
    deviceData[d.deviceId].totalTemp += parseFloat(d.temperature);
    deviceData[d.deviceId].totalPressure += parseFloat(d.pressure);
    deviceData[d.deviceId].count++;
  });

  // ✅ Averages for all three parameters
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

  console.log("\n🕒 New 10-Minute Motor Operational Schedule Generated:");
  console.table(newSchedule);

}, 10 * 60 * 1000);


}

consumeMotorData().catch(console.error);