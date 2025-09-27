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
  const CACHE_KEY = 'aggregatedMotorDataCache';

  // Initialize state from localStorage to provide instant data on load.
  const [aggregatedData, setAggregatedData] = useState<AggregatedInfo>(() => {
    try {
      const cachedData = localStorage.getItem(CACHE_KEY);
      return cachedData ? JSON.parse(cachedData) : { metrics: {}, schedule: {} };
    } catch (error) {
      console.error("Error reading aggregated data from localStorage:", error);
      return { metrics: {}, schedule: {} };
    }
  });

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'schedule') {
        const newData = { metrics: message.metrics, schedule: message.schedule };
        setAggregatedData(newData);
        // Cache the new data in localStorage.
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(newData));
        } catch (error) {
          console.error("Error writing aggregated data to localStorage:", error);
        }
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  return aggregatedData;
};