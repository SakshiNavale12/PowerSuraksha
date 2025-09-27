import { useState, useEffect } from 'react';
import { getDatabase, ref, query, orderByChild, startAt, endAt, get, DataSnapshot } from 'firebase/database';

export interface HistoricalDataPoint {
  temperature: number;
  pressure: number;
  current: number;
  timestamp: string;
}

export const useHistoricalMotorData = (deviceId: string, timeMinutes: number) => {
  const [data, setData] = useState<HistoricalDataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!deviceId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const db = getDatabase();
        const now = new Date();
        const startTime = new Date(now.getTime() - timeMinutes * 60 * 1000);

        const motorDataRef = ref(db, 'motorData');
        
        // This query is broad and will be filtered on the client.
        // For production, you would ideally have a backend endpoint or use Cloud Functions 
        // to perform indexed queries on `deviceId` and `timestamp`.
        const q = query(motorDataRef, orderByChild('timestamp'), startAt(startTime.toISOString()), endAt(now.toISOString()));

        const snapshot = await get(q);
        const fetchedData: HistoricalDataPoint[] = [];
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot: DataSnapshot) => {
            const record = childSnapshot.val();
            if (record.deviceId === deviceId) {
              fetchedData.push(record);
            }
          });
        }
        setData(fetchedData.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()));
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [deviceId, timeMinutes]);

  return { data, loading, error };
};