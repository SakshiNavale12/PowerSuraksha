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
      // The message type is now 'schedule' and the data is not in a 'payload' object.
      if (message.type === 'schedule') {
        // We only need the metrics and schedule for the current UI.
        setAggregatedData({ metrics: message.metrics, schedule: message.schedule });
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  return aggregatedData;
};