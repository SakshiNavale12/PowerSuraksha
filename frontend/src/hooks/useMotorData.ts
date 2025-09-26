import { useState, useEffect } from 'react';

export interface RealtimeMotorData {
  deviceId: string;
  temperature: string;
  pressure: string;
  current: string;
  timestamp: string;
}

// This is for the aggregated data
export interface AggregatedMotorData {
  avgCurrent: number;
  avgTemp: number;
  avgPressure: number;
}

export interface DeviceData {
  [deviceId: string]: AggregatedMotorData;
}

export interface ScheduleData {
  [deviceId: string]: string;
}

export interface AggregatedInfo {
  metrics: DeviceData;
  schedule: ScheduleData;
}

export const useMotorData = () => {
  const [aggregatedData, setAggregatedData] = useState<AggregatedInfo>({ metrics: {}, schedule: {} });
  const [realtimeData, setRealtimeData] = useState<{ [deviceId: string]: RealtimeMotorData }>({});

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'aggregate') {
        setAggregatedData(message.payload);
      } else if (message.type === 'realtime') {
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

  return { aggregatedData, realtimeData };
};
