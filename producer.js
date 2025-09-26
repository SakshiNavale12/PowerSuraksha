const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "iot-simulator",
  brokers: ["localhost:9092"],
});

const producer = kafka.producer();

async function sendData() {
  await producer.connect();

  setInterval(async () => {
    const data = {
      deviceId: "device-" + Math.floor(Math.random() * 100),
      temperature: (20 + Math.random() * 15).toFixed(2),
      pressure: (900 + Math.random() * 200).toFixed(2),
      current: (1 + Math.random() * 5).toFixed(2),
      timestamp: new Date().toISOString(),
    };

    await producer.send({
      topic: "iot-data",
      messages: [{ value: JSON.stringify(data) }],
    });

    console.log("Sent:", data);
  }, 2000);
}

sendData().catch(console.error);
