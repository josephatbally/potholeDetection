import React, { useState, useEffect } from 'react';
import { usePotholes } from '../hooks/usePotholes';
import Map from '../components/Map';
import ReportsList from '../components/ReportsList';
import { socketService } from '../services/socket';
import { Pothole } from '../types';

const Dashboard: React.FC = () => {
  const { potholes, setPotholes, loading, error } = usePotholes();
  const [reports, setReports] = useState<any[]>([]);
  const [alert, setAlert] = useState<string | null>(null);

  // Convert potholes to reports format (for list)
  useEffect(() => {
    if (potholes.length > 0) {
      const formatted = potholes.map(p => ({
        id: p.id,
        location: `${p.location?.coordinates?.[1]?.toFixed(4) || ''}, ${p.location?.coordinates?.[0]?.toFixed(4) || ''}`,
        sensorId: p.sensorId,
        depth: p.depth,
        confirms: p.citizenReports || 0,
        distance: 0, // we don't have distance from user; can be calculated later
        severity: p.severity,
        status: p.status,
      }));
      setReports(formatted);
    }
  }, [potholes]);

  // Socket for real-time updates
  useEffect(() => {
    const socket = socketService.connect();

    // Listen for new/updated potholes
    socket.on('pothole_update', (updatedPothole: Pothole) => {
      setPotholes(prev => {
        const existing = prev.find(p => p.id === updatedPothole.id);
        if (existing) {
          return prev.map(p => p.id === updatedPothole.id ? updatedPothole : p);
        } else {
          return [updatedPothole, ...prev];
        }
      });
    });

    // Listen for alerts (e.g., pothole ahead)
    socket.on('alert', (data) => {
      if (data.type === 'vibration' || data.type === 'depth') {
        setAlert(`⚠️ Pothole ahead! ${data.message}`);
        setTimeout(() => setAlert(null), 10000);
      }
    });

    return () => {
      socket.off('pothole_update');
      socket.off('alert');
    };
  }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{
      height: '100vh',
      width: '100%',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <header style={{ borderBottom: '2px solid #333', paddingBottom: '10px', marginBottom: '20px', flexShrink: 0 }}>
        <h1 style={{ margin: 0, fontSize: '1.8rem' }}>RoadWatch</h1>
        <p style={{ color: '#555', margin: '4px 0 0' }}>
          CITIZEN WEB DASHBOARD — Watch the live map and see potholes near you.
        </p>
      </header>

      {alert && (
        <div style={{ backgroundColor: '#f44336', color: 'white', padding: '12px', borderRadius: '8px', marginBottom: '12px' }}>
          {alert}
        </div>
      )}

      <div className="dashboard-grid">
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ flex: 1, minHeight: '200px' }}>
            <Map potholes={potholes} />
          </div>
          <div style={{
            display: 'flex',
            gap: '16px',
            marginTop: '8px',
            fontSize: '0.85rem',
            flexWrap: 'wrap',
            flexShrink: 0,
          }}>
            <span><span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#f44336', marginRight: '4px' }}></span> Severe</span>
            <span><span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ff9800', marginRight: '4px' }}></span> Moderate</span>
            <span><span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#2196f3', marginRight: '4px' }}></span> Recently fixed</span>
            <span><span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#9c27b0', marginRight: '4px' }}></span> Crew on site</span>
          </div>
        </div>
        <div style={{ overflowY: 'auto', paddingRight: '4px' }}>
          <ReportsList reports={reports} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
