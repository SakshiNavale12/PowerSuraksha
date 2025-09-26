const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "motor-simulator",
  brokers: ["localhost:9092"],
});

const producer = kafka.producer();

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

async function sendMotorData() {
  await producer.connect();

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
      topic: "iot-data",
      messages,
    });

    console.log(`Sent batch of 100 motor readings at ${new Date().toLocaleTimeString()}`);
  }, 2000);
}

sendMotorData().catch(console.error);
