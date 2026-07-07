import { useEffect, useState } from 'react';
import { Pothole } from '../types';
import { fetchPotholes } from '../services/api';

export const usePotholes = () => {
  const [potholes, setPotholes] = useState<Pothole[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchPotholes();
        setPotholes(data);
      } catch (err) {
        setError('Failed to load pothole data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return { potholes, setPotholes, loading, error };
};
