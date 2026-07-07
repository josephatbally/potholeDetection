import { useEffect, useState } from 'react';
import { Alert } from '../types';
import { fetchAlerts } from '../services/api';

export const useAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchAlerts();
        setAlerts(data);
      } catch (err) {
        setError('Failed to load alerts');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return { alerts, loading, error };
};
