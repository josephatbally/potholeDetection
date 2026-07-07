import React, { useState, useEffect } from 'react';
import { fetchPotholes } from '../services/api';

interface Sensor {
  id: string;
  vehicle: string;
  location: string;
  status: 'online' | 'offline' | 'maintenance';
  battery: number;
  lastReading: string;
  depth: number;
}

const SensorNetwork: React.FC = () => {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock sensor data – in real app, fetch from API
    const mockSensors: Sensor[] = [
      { id: 'SENSOR-2214', vehicle: 'Toyota HiAce', location: '-6.7924, 39.2083', status: 'online', battery: 87, lastReading: '2 min ago', depth: 6.3 },
      { id: 'SENSOR-2212', vehicle: 'Nissan Navara', location: '-6.8000, 39.2200', status: 'online', battery: 92, lastReading: '5 min ago', depth: 5.1 },
      { id: 'SENSOR-2217', vehicle: 'Isuzu D-Max', location: '-6.8100, 39.2100', status: 'online', battery: 76, lastReading: '10 min ago', depth: 3.8 },
      { id: 'SENSOR-0774', vehicle: 'Toyota Hilux', location: '-6.7900, 39.2300', status: 'offline', battery: 14, lastReading: '3 hours ago', depth: 4.4 },
      { id: 'SENSOR-1187', vehicle: 'Ford Ranger', location: '-6.7850, 39.2000', status: 'maintenance', battery: 45, lastReading: '1 day ago', depth: 0 },
    ];
    setSensors(mockSensors);
    setLoading(false);
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
              <th style={{ padding: '12px' }}>Depth (cm)</th>
            </tr>
          </thead>
          <tbody>
            {sensors.map((s) => (
              <tr key={s.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px' }}>{s.id}</td>
                <td style={{ padding: '12px' }}>{s.vehicle}</td>
                <td style={{ padding: '12px' }}>{s.location}</td>
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
                <td style={{ padding: '12px' }}>{s.lastReading}</td>
                <td style={{ padding: '12px' }}>{s.depth > 0 ? s.depth : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SensorNetwork;
