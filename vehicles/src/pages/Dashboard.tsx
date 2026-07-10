import React, { useState, useEffect } from 'react';
import { usePotholes } from '../hooks/usePotholes';
import Map from '../components/Map';
import ReportsList from '../components/ReportsList';
import { socketService } from '../services/socket';
import { Pothole, Notification } from '../types';

const Dashboard: React.FC = () => {
  const { potholes, setPotholes, loading, error } = usePotholes();
  const [reports, setReports] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Fetch notifications from API on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/notifications?target=citizens&limit=20');
        if (!res.ok) throw new Error('Failed to fetch notifications');
        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    };
    fetchNotifications();
  }, []);

  // Transform potholes to reports
  useEffect(() => {
    if (potholes.length > 0) {
      const formatted = potholes.map(p => ({
        id: p.id,
        location: p.locationName || `(${p.lat?.toFixed(4) || ''}, ${p.lng?.toFixed(4) || ''})`,
        sensorId: p.sensorId,
        depth: p.depth,
        confirms: p.citizenReports || 0,
        distance: 0,
        severity: p.severity,
        status: p.status,
        detectedAt: p.detectedAt,
      }));
      setReports(formatted);
    } else {
      setReports([]);
    }
  }, [potholes]);

  // Socket for real‑time updates
  useEffect(() => {
    const socket = socketService.connect();
    socket.on('pothole_update', (updated: Pothole) => {
      setPotholes(prev => {
        const exists = prev.find(p => p.id === updated.id);
        if (exists) return prev.map(p => p.id === updated.id ? updated : p);
        return [updated, ...prev];
      });
    });
    socket.on('alert', (data) => {
      if (data.type === 'notification') {
        const newNotif: Notification = {
          id: data.notificationId || Date.now().toString(),
          title: data.title || 'Notification',
          message: data.message,
          type: data.type || 'info',
          createdAt: data.createdAt || new Date().toISOString(),
        };
        setNotifications(prev => [newNotif, ...prev]);
      } else if (data.type === 'vibration' || data.type === 'depth') {
        // Also add as a notification
        const newNotif: Notification = {
          id: Date.now().toString(),
          title: '⚠️ Pothole ahead!',
          message: data.message,
          type: 'alert',
          createdAt: new Date().toISOString(),
        };
        setNotifications(prev => [newNotif, ...prev]);
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
    <div style={{ height: '100vh', width: '100%', padding: '20px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <header style={{ borderBottom: '2px solid #333', paddingBottom: '10px', marginBottom: '20px', flexShrink: 0 }}>
        <h1 style={{ margin: 0, fontSize: '1.8rem' }}>RoadWatch</h1>
        <p style={{ color: '#555', margin: '4px 0 0' }}>CITIZEN WEB DASHBOARD — Watch the live map and see potholes near you.</p>
      </header>

      <div className="dashboard-grid">
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ flex: 1, minHeight: '200px' }}><Map potholes={potholes} /></div>
          <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '0.85rem', flexWrap: 'wrap', flexShrink: 0 }}>
            <span><span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#f44336', marginRight: '4px' }}></span> Severe</span>
            <span><span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ff9800', marginRight: '4px' }}></span> Moderate</span>
            <span><span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#2196f3', marginRight: '4px' }}></span> Recently fixed</span>
            <span><span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#9c27b0', marginRight: '4px' }}></span> Crew on site</span>
          </div>
        </div>
        <div style={{ overflowY: 'auto', paddingRight: '4px' }}>
          <ReportsList reports={reports} notifications={notifications} />
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
