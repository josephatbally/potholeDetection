import { useEffect, useState } from 'react';
import { Report } from '../types';
import { fetchNearbyReports } from '../services/api';

export const useReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchNearbyReports();
        setReports(data);
      } catch (err) {
        setError('Failed to load reports');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return { reports, loading, error };
};
