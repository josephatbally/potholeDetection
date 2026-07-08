import { useEffect, useState } from 'react';
import { Alert } from '../types';
import { fetchAlerts } from '../services/api';
import { connectSocket } from '../services/socket';

export const useAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadAlerts = async () => {
    try {
      const data = await fetchAlerts();
      setAlerts(data);
    } catch (err) {
      setError('Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();

    // Socket listener for new alerts
    const socket = connectSocket();
    socket.on('alert', (newAlert: Alert) => {
      setAlerts(prev => [newAlert, ...prev.slice(0, 9)]); // keep last 10
    });

    return () => {
      socket.off('alert');
    };
  }, []);

  return { alerts, loading, error };
};
