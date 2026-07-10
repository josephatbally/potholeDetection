import React, { useState, useEffect } from 'react';
import { socketService } from '../services/socket';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  severity: string;
  area?: string;
  createdAt: string;
}

const NotificationBanner: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    // Fetch recent notifications from API
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    fetch(`${API_URL}/notifications?activeOnly=true`)
      .then(res => res.json())
      .then(data => setNotifications(data))
      .catch(err => console.error('Failed to fetch notifications', err));

    // Listen for new notifications via socket
    const socket = socketService.connect();
    socket.on('alert', (data) => {
      if (data.type === 'notification') {
        // Data contains { message, notificationId }
        // We need to fetch the full notification or assume it's new.
        // We'll just add a temporary item with the message.
        const newNotif: Notification = {
          id: data.notificationId || Date.now().toString(),
          title: 'New Alert',
          message: data.message,
          type: 'general',
          severity: 'info',
          createdAt: new Date().toISOString(),
        };
        setNotifications(prev => [newNotif, ...prev]);
        setShowBanner(true);
      }
    });
    return () => {
      socket.off('alert');
    };
  }, []);

  if (!showBanner || notifications.length === 0) return null;

  const latest = notifications[0];
  const severityColor = latest.severity === 'critical' ? '#f44336' : latest.severity === 'warning' ? '#ff9800' : '#2196f3';

  return (
    <div style={{
      backgroundColor: severityColor,
      color: 'white',
      padding: '12px 20px',
      borderRadius: '8px',
      marginBottom: '12px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <div>
        <strong>{latest.title}</strong> – {latest.message}
        {latest.area && <span style={{ marginLeft: '8px' }}>({latest.area})</span>}
      </div>
      <button onClick={() => setShowBanner(false)} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer' }}>×</button>
    </div>
  );
};
export default NotificationBanner;
