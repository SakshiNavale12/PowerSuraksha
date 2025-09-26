module.exports = {
  kafka: {
    brokers: ["localhost:9092"],
    clientId: "motor-simulator",
    topic: "iot-data",
  },
  consumer: {
    groupId: "motor-group",
  },
};
