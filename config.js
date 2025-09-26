module.exports = {
  kafka: {
    brokers: ["localhost:9092"],
    clientId: "motor-simulator",
    topic: "iot-data",
  },
  consumer: {
    groupId: "motor-group",
  },
  firebase: {
    databaseURL:"https://hack-b2700-default-rtdb.asia-southeast1.firebasedatabase.app"
  }
};
