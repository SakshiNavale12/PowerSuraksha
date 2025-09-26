const TOTAL_DEVICES = 100;


function generateSensorData(sensorId) {
  return {
    sensorId,
    temperature: Math.floor(Math.random() * 60) + 10, // 10 - 70 °C
    pressure: Math.floor(Math.random() * 50) + 950,   // 950 - 1000 hPa
    current: Math.floor(Math.random() * 10) + 1,      // 1 - 10 Amp
    timestamp: new Date().toISOString()
  };
}


setInterval(() => {
  const allData = [];
  for (let i = 1; i <= TOTAL_DEVICES; i++) {
    const data = generateSensorData(i);
    allData.push(data);
  }

  console.log("Batch of simulated sensor data:", allData.length, "records");
  // 🔹 In next steps, you’ll send `allData` to Kafka / API instead of console.log
}, 2000);
