import { useState, useEffect } from 'react';

export interface MotorData {
  avgCurrent: number;
  avgTemp: number;
  avgPressure: number;
}

export interface DeviceData {
  [deviceId: string]: MotorData;
}

export interface ScheduleData {
  [deviceId: string]: string;
}

export interface MotorInfo {
  metrics: DeviceData;
  schedule: ScheduleData;
}

export const useMotorData = () => {
  const [data, setData] = useState<MotorInfo>({ metrics: {}, schedule: {} });

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setData(message);
    };

    return () => {
      ws.close();
    };
  }, []);

  return data;
};
