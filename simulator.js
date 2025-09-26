const TOTAL_DEVICES = 100;

// Function to randomly decide if fault should be injected
function isFault() {
  return Math.random() < 0.05; // 5% chance of fault
}

function generateSensorData(deviceId) {
  let temperature, current, pressure;

  // Normal ranges
  temperature = (Math.random() * (80 - 40)) + 40; // 40–80
  current = (Math.random() * (12 - 8)) + 8;       // 8–12
  pressure = 3;                                   // constant 3

  // Fault injection
  if (isFault()) {
    const faultType = Math.floor(Math.random() * 3); // 0=temp,1=current,2=pressure
    switch (faultType) {
      case 0: // Temperature fault
        temperature = (Math.random() * 50) + 90; // 90–140
        break;
      case 1: // Current fault
        current = (Math.random() * 15); // 0–15 (can drop to 0 or rise high)
        break;
      case 2: // Pressure fault
        pressure = (Math.random() * 10); // 0–10 random
        break;
    }
  }

  return {
    deviceId,
    sensorTemperature: parseFloat(temperature.toFixed(2)),
    sensorPressure: parseFloat(pressure.toFixed(2)),
    sensorCurrent: parseFloat(current.toFixed(2)),
    timestamp: new Date().toISOString()
  };
}

setInterval(() => {
  const allData = [];
  for (let i = 1; i <= TOTAL_DEVICES; i++) {
    const data = generateSensorData(i);
    allData.push(data);
  }

  console.log("Batch of simulated sensor data:", allData, "records");
  // In next steps, you’ll send `allData` to Kafka / API instead of console.log
}, 1000);
