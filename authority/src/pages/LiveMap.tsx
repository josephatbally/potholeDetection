import React from 'react';
import { usePotholes } from '../hooks/usePotholes';
import Map from '../components/Map';

const LiveMap: React.FC = () => {
  const { potholes, loading, error } = usePotholes();

  if (loading) return <div>Loading map...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h1 style={{ marginTop: 0, fontWeight: 300 }}>Live Map</h1>
      <p style={{ color: 'var(--text-secondary)' }}>All detected potholes in Dar es Salaam</p>
      <div style={{ flex: 1, minHeight: '400px', marginTop: '12px' }}>
        <Map potholes={potholes} />
      </div>
      <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '0.85rem', flexWrap: 'wrap' }}>
        <span><span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#f44336', marginRight: '4px' }}></span> Severe</span>
        <span><span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ff9800', marginRight: '4px' }}></span> Moderate</span>
        <span><span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#2196f3', marginRight: '4px' }}></span> Recently fixed</span>
        <span><span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#9c27b0', marginRight: '4px' }}></span> Crew on site</span>
      </div>
    </div>
  );
};

export default LiveMap;
