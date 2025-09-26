import { useState, useEffect } from 'react';

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

export const useAggregatedMotorData = () => {
  const [aggregatedData, setAggregatedData] = useState<AggregatedInfo>({ metrics: {}, schedule: {} });

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'aggregate') {
        setAggregatedData(message.payload);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  return aggregatedData;
};