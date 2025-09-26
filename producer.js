const { Kafka } = require("kafkajs");
const config = require("./config");

const kafka = new Kafka({
  clientId: config.kafka.clientId,
  brokers: config.kafka.brokers,
});

const producer = kafka.producer();

const sendMotorData = async () => {
  try {
    await producer.connect();
    console.info("Producer connected to Kafka");

    setInterval(async () => {
      const messages = [];
      for (let i = 1; i <= 100; i++) {
        const data = {
          deviceId: `motor-${i}`,
          temperature: (40 + Math.random() * 55).toFixed(2),
          pressure: (900 + Math.random() * 200).toFixed(2),
          current: getBiasedCurrent(),
          timestamp: new Date().toISOString(),
        };
        messages.push({ value: JSON.stringify(data) });
      }

      await producer.send({
        topic: config.kafka.topic,
        messages,
      });

      console.info(`Sent batch of 100 motor readings at ${new Date().toLocaleTimeString()}`);
    }, 2000);
  } catch (error) {
    console.error("Error starting producer:", error);
    process.exit(1);
  }
};

function getBiasedCurrent() {
  const p = Math.random();

  if (p < 0.49) {
    // Morning slot (≈48-50%)
    return (5 + Math.random() * 4.9).toFixed(2);
  } else if (p < 0.73) {
    // Night slot (≈23-24%)
    return (10 + Math.random() * 4.9).toFixed(2);
  } else if (p < 0.97) {
    // Evening slot (≈23-24%)
    return (15 + Math.random() * 5).toFixed(2);
  } else {
    // Excluded (≈2-4%)
    return (20.1 + Math.random() * 4.9).toFixed(2);
  }
}

const gracefulShutdown = async () => {
  console.info("Producer is shutting down...");
  try {
    await producer.disconnect();
    console.info("Producer disconnected from Kafka");
  } catch (error) {
    console.error("Error during graceful shutdown:", error);
  } finally {
    process.exit(0);
  }
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

sendMotorData();
