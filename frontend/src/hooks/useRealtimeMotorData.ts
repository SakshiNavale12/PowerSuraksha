import { useState, useEffect } from 'react';

export interface RealtimeMotorData {
  deviceId: string;
  temperature: string;
  pressure: string;
  current: string;
  timestamp: string;
}

export const useRealtimeMotorData = () => {
  const [realtimeData, setRealtimeData] = useState<{ [deviceId: string]: RealtimeMotorData }>({});

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'realtime') {
        const newRealtimeData: RealtimeMotorData = message.payload;
        setRealtimeData(prev => ({
          ...prev,
          [newRealtimeData.deviceId]: newRealtimeData,
        }));
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  return realtimeData;
};