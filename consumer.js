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
      console.log(`Received: ${message.value.toString()}`);
    },
  });
}

consumeData().catch(console.error);
