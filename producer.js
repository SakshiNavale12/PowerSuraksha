const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "iot-simulator",
  brokers: ["localhost:9092"],
});

const producer = kafka.producer();

async function sendData() {
  await producer.connect();

  setInterval(async () => {
  const messages = [];

  for (let i = 1; i <= 100; i++) {
    const data = {
      deviceId: `device-${i}`,
      temperature: (20 + Math.random() * 15).toFixed(2),
      pressure: (900 + Math.random() * 200).toFixed(2),
      current: (1 + Math.random() * 5).toFixed(2),
      timestamp: new Date().toISOString(),
    };
    messages.push({ value: JSON.stringify(data) });
  }

  await producer.send({
    topic: "iot-data",
    messages,
  });

  console.log(`Sent batch of 100 readings at ${new Date().toLocaleTimeString()}`);
}, 2000);

}

sendData().catch(console.error);
