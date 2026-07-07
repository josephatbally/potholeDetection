import React, { useState, useEffect } from 'react';
import { fetchCrews } from '../services/api';
import { Crew } from '../types';

const RepairCrews: React.FC = () => {
  const [crews, setCrews] = useState<Crew[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCrews().then(data => {
      setCrews(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading crews...</div>;

  return (
    <div>
      <h1 style={{ marginTop: 0, fontWeight: 300 }}>Repair Crews</h1>
      <p style={{ color: 'var(--text-secondary)' }}>Track crew assignments and status.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '16px' }}>
        {crews.map((crew) => (
          <div key={crew.id} style={{ backgroundColor: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ marginTop: 0 }}>{crew.name}</h3>
            <p>Status: 
              <span style={{
                display: 'inline-block',
                marginLeft: '8px',
                padding: '2px 10px',
                borderRadius: '12px',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                backgroundColor: crew.status === 'on_site' ? '#4caf50' : crew.status === 'on_route' ? '#ff9800' : '#2196f3',
                color: 'white',
              }}>
                {crew.status.replace('_', ' ')}
              </span>
            </p>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              {crew.status === 'on_site' ? 'Currently repairing a pothole.' :
               crew.status === 'on_route' ? 'En route to a pothole.' :
               'Available for assignment.'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RepairCrews;
