import React, { useState, useEffect } from 'react';
import StatsCards from '../components/StatsCards';
import AlertsList from '../components/AlertsList';
import Map from '../components/Map';
import { usePotholes } from '../hooks/usePotholes';
import { useAlerts } from '../hooks/useAlerts';
import { fetchStats } from '../services/api';

const Overview: React.FC = () => {
  const { potholes, loading: pLoading, error: pError } = usePotholes();
  const { alerts, loading: aLoading, error: aError } = useAlerts();
  const [stats, setStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    fetchStats().then(data => {
      setStats(data);
      setStatsLoading(false);
    });
  }, []);

  if (pLoading || aLoading || statsLoading) return <div>Loading overview...</div>;
  if (pError || aError) return <div>Error loading data</div>;

  // Count potholes by status
  const total = potholes.length;
  const detected = potholes.filter(p => p.status === 'detected').length;
  const inProgress = potholes.filter(p => p.status === 'in_progress').length;
  const repaired = potholes.filter(p => p.status === 'repaired').length;

  return (
    <div>
      <h1 style={{ marginTop: 0, fontWeight: 300 }}>Overview</h1>
      <p style={{ color: 'var(--text-secondary)' }}>Real‑time summary of road conditions in Dar es Salaam.</p>

      {stats && <StatsCards stats={stats} />}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
        <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px', boxShadow: 'var(--shadow)' }}>
          <h3 style={{ marginTop: 0 }}>Quick Stats</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div><strong>Total</strong><br />{total}</div>
            <div><strong>Detected</strong><br />{detected}</div>
            <div><strong>In Progress</strong><br />{inProgress}</div>
            <div><strong>Repaired</strong><br />{repaired}</div>
          </div>
        </div>
        <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px', boxShadow: 'var(--shadow)' }}>
          <h3 style={{ marginTop: 0 }}>Recent Alerts</h3>
          <AlertsList alerts={alerts.slice(0, 3)} />
        </div>
      </div>

      <div style={{ marginTop: '20px', backgroundColor: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px', boxShadow: 'var(--shadow)' }}>
        <h3 style={{ marginTop: 0 }}>Pothole Map Preview</h3>
        <div style={{ height: '300px' }}>
          <Map potholes={potholes.slice(0, 10)} />
        </div>
      </div>
    </div>
  );
};

export default Overview;
