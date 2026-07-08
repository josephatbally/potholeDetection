import React, { useState, useEffect } from 'react';
import { fetchSensors } from '../services/api';

interface Sensor {
  id: string;
  sensorId: string;
  vehicle: string;
  location: { coordinates: [number, number] };
  status: 'online' | 'offline' | 'maintenance';
  battery: number;
  lastReading: string;
}

const SensorNetwork: React.FC = () => {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSensors()
      .then(data => {
        setSensors(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading sensor data...</div>;

  return (
    <div>
      <h1 style={{ marginTop: 0, fontWeight: 300 }}>Sensor Network</h1>
      <p style={{ color: 'var(--text-secondary)' }}>Real-time status of IoT sensors on vehicles.</p>
      <div style={{ overflowX: 'auto', marginTop: '16px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'var(--bg-secondary)', boxShadow: 'var(--shadow)', borderRadius: '8px' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--card-bg)', textAlign: 'left' }}>
              <th style={{ padding: '12px' }}>Sensor ID</th>
              <th style={{ padding: '12px' }}>Vehicle</th>
              <th style={{ padding: '12px' }}>Location</th>
              <th style={{ padding: '12px' }}>Status</th>
              <th style={{ padding: '12px' }}>Battery</th>
              <th style={{ padding: '12px' }}>Last Reading</th>
            </tr>
          </thead>
          <tbody>
            {sensors.map((s) => (
              <tr key={s.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px' }}>{s.sensorId}</td>
                <td style={{ padding: '12px' }}>{s.vehicle}</td>
                <td style={{ padding: '12px' }}>
                  {s.location.coordinates[1].toFixed(4)}, {s.location.coordinates[0].toFixed(4)}
                </td>
                <td style={{ padding: '12px' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '2px 10px',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    backgroundColor: s.status === 'online' ? '#4caf50' : s.status === 'offline' ? '#f44336' : '#ff9800',
                    color: 'white',
                  }}>
                    {s.status}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '60px', height: '6px', backgroundColor: '#ddd', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${s.battery}%`, height: '100%', backgroundColor: s.battery > 50 ? '#4caf50' : s.battery > 20 ? '#ff9800' : '#f44336' }} />
                    </div>
                    <span>{s.battery}%</span>
                  </div>
                </td>
                <td style={{ padding: '12px' }}>{new Date(s.lastReading).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SensorNetwork;
