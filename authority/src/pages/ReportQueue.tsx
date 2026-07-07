import React, { useState, useEffect } from 'react';
import ReportsQueueTable from '../components/ReportsQueueTable';
import { usePotholes } from '../hooks/usePotholes';
import { fetchCrews, updatePotholeStatus, assignCrew } from '../services/api';
import { Pothole } from '../types';

const ReportQueue: React.FC = () => {
  const { potholes, setPotholes, loading, error } = usePotholes();
  const [crews, setCrews] = useState<string[]>([]);
  const [crewsLoading, setCrewsLoading] = useState(true);

  useEffect(() => {
    fetchCrews().then(data => {
      setCrews(data.map(c => c.name));
      setCrewsLoading(false);
    });
  }, []);

  const handleStatusChange = (id: string, newStatus: string) => {
    updatePotholeStatus(id, newStatus as Pothole['status']).then((updated) => {
      setPotholes((prev) => prev.map((p) => (p.id === id ? updated : p)));
    });
  };

  const handleAssignCrew = (id: string, crewName: string) => {
    assignCrew(id, crewName).then((updated) => {
      setPotholes((prev) => prev.map((p) => (p.id === id ? updated : p)));
    });
  };

  if (loading || crewsLoading) return <div>Loading reports...</div>;
  if (error) return <div>Error: {error}</div>;

  const queueItems = potholes.map((p) => ({
    ...p,
    locationName: `${p.lat.toFixed(4)}, ${p.lng.toFixed(4)}`,
    sensorScore: p.sensorScore || 0,
    sourceLabel: p.source === 'sensor' ? 'Sensor' : p.source === 'citizen' ? 'Citizen' : 'Sensor + citizens',
    assignedCrewName: p.assignedCrew || 'Unassigned',
  }));

  return (
    <div>
      <h1 style={{ marginTop: 0, fontWeight: 300 }}>Report Queue</h1>
      <p style={{ color: 'var(--text-secondary)' }}>Prioritized list of potholes requiring attention.</p>
      <ReportsQueueTable
        items={queueItems}
        onStatusChange={handleStatusChange}
        onAssignCrew={handleAssignCrew}
        crews={crews}
      />
    </div>
  );
};

export default ReportQueue;
