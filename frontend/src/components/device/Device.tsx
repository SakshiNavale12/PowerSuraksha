import React from 'react';
import { useRealtimeMotorData } from '../../hooks/useRealtimeMotorData';

// Basic styling for the container holding all the cards
const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '20px',
  padding: '20px',
  fontFamily: 'sans-serif',
};

// Basic styling for an individual device card
const cardStyle: React.CSSProperties = {
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
  padding: '16px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#ffffff',
  minWidth: '220px',
  flex: 1,
};

// Styling for the card title (Device ID)
const cardTitleStyle: React.CSSProperties = {
  margin: '0 0 12px 0',
  color: '#333',
  fontSize: '1.25rem',
  borderBottom: '1px solid #eee',
  paddingBottom: '8px',
};

// Styling for each metric line (e.g., Temperature, Pressure)
const metricStyle: React.CSSProperties = {
  margin: '8px 0',
  fontSize: '1rem',
  display: 'flex',
  justifyContent: 'space-between',
};

export default function Device() {
  const realtimeData = useRealtimeMotorData();

  // If there's no data yet, you can show a loading message
  if (Object.keys(realtimeData).length === 0) {
    return <div style={{ padding: '20px' }}>Loading device data...</div>;
  }

  return (
    <div style={containerStyle}>
        <h2>Device Data</h2>
      {Object.entries(realtimeData).map(([deviceId, data]) => (
        <div key={deviceId} style={cardStyle}>
          <h3 style={cardTitleStyle}>{deviceId}</h3>
          <p style={metricStyle}>
            <strong>Temperature:</strong>
            {/* Using toFixed(2) to format the number to two decimal places */}
            <span>{parseFloat(data.temperature).toFixed(2)} °C</span>
          </p>
          <p style={metricStyle}>
            <strong>Pressure:</strong>
            <span>{parseFloat(data.pressure).toFixed(2)} hPa</span>
          </p>
          <p style={metricStyle}>
            <strong>Current:</strong>
            <span>{parseFloat(data.current).toFixed(2)} A</span>
          </p>
        </div>
      ))}
    </div>
  );
}