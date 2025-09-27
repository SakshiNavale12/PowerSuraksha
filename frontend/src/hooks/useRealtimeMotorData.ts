import { useState, useEffect } from 'react';

export interface RealtimeMotorData {
  deviceId: string;
  temperature: string;
  pressure: string;
  current: string;
  timestamp: string;
}

export const useRealtimeMotorData = () => {
  const CACHE_KEY = 'realtimeMotorDataCache';

  // Initialize state from localStorage for an instant UI update.
  const [realtimeData, setRealtimeData] = useState<{ [deviceId: string]: RealtimeMotorData }>(() => {
    try {
      const cachedData = localStorage.getItem(CACHE_KEY);
      return cachedData ? JSON.parse(cachedData) : {};
    } catch (error) {
      console.error("Error reading real-time data from localStorage:", error);
      return {};
    }
  });

  // A separate effect to save data to cache whenever it changes.
  useEffect(() => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(realtimeData));
    } catch (error) {
      console.error("Error writing real-time data to localStorage:", error);
    }
  }, [realtimeData]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'realtime') {
        const { deviceId, data, timestamp } = message;
        const newRealtimeData: RealtimeMotorData = {
          deviceId: deviceId,
          temperature: data.temperature,
          pressure: data.pressure,
          current: data.current,
          timestamp: timestamp,
        };
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