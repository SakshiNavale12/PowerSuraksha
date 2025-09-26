const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "iot-consumer",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "iot-group" });

async function consumeData() {
  await consumer.connect();
  await consumer.subscribe({ topic: "iot-data", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const data = JSON.parse(message.value.toString());

      const temperature = parseFloat(data.temperature);
      const current = parseFloat(data.current);
      const pressure = parseFloat(data.pressure);

      if (current > 4.5) {
        console.log("⚡ ALERT: High current!", data);
      }
      if (temperature > 35) {
        console.log("🔥 ALERT: Overheating!", data);
      }
      if (pressure < 950 || pressure > 1100) {
        console.log("⚠️ ALERT: Unsafe pressure!", data);
      }
    },
  });
}

consumeData().catch(console.error);
