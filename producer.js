
const { Kafka } = require("kafkajs");
const config = require("./config");
const admin = require("firebase-admin");

const serviceAccount = require("./firebase-service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: config.firebase.databaseURL || "https://hack-b2700-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const db = admin.database();
const kafka = new Kafka({
  clientId: config.kafka.clientId,
  brokers: config.kafka.brokers,
});
const producer = kafka.producer();

function getBiasedCurrent() {
  const p = Math.random();
  if (p < 0.49) return (5 + Math.random() * 4.9).toFixed(2);
  if (p < 0.73) return (10 + Math.random() * 4.9).toFixed(2);
  if (p < 0.97) return (15 + Math.random() * 5).toFixed(2);
  return (20.1 + Math.random() * 4.9).toFixed(2);
}

const DEVICE_CONFIG = [
  { prefix: 'motor', count: 100 },
  { prefix: 'pump', count: 50 },
  { prefix: 'generator', count: 50 },
  { prefix: 'compressor', count: 20 },
];

const sendMotorData = async () => {
  try {
    await producer.connect();
    console.info("Producer connected to Kafka");

    setInterval(async () => {
      const messages = [];
      const updates = {};

      const baseRef = db.ref('motorData');

      for (const { prefix, count } of DEVICE_CONFIG) {
        for (let i = 1; i <= count; i++) {
          const data = {
            deviceId: `${prefix}-${i}`,
            temperature: parseFloat((40 + Math.random() * 55).toFixed(2)),
            pressure: parseFloat((900 + Math.random() * 200).toFixed(2)),
            current: parseFloat(getBiasedCurrent()),
            timestamp: new Date().toISOString(),
            createdAt: admin.database.ServerValue.TIMESTAMP,
          };

          const pushKey = baseRef.push().key;
          updates[`motorData/${pushKey}`] = data;

          messages.push({
            value: JSON.stringify({
              ...data,
              source: "realtime",
              rtdbKey: pushKey,
              batchId: Date.now()
            })
          });
        }
      }

      // Firebase write (non-blocking — Kafka runs even if Firebase fails)
      db.ref().update(updates)
        .then(() => console.info(`Stored ${Object.keys(updates).length} records in Realtime DB`))
        .catch(err => console.warn("Firebase write failed (non-critical):", err.message));

      // Always send to Kafka regardless of Firebase status
      try {
        await producer.send({
          topic: config.kafka.topic,
          messages,
        });
        console.info(`Sent batch of ${messages.length} motor readings at ${new Date().toLocaleTimeString()}`);
      } catch (err) {
        console.error("Error sending to Kafka:", err);
      }
    }, 2000);
  } catch (err) {
    console.error("Error starting producer:", err);
    process.exit(1);
  }
};

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
