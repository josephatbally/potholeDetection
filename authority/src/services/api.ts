const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const fetchPotholes = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = `${API_URL}/potholes${query ? '?' + query : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch potholes');
  const data = await res.json();
  // Transform to frontend format (lat, lng)
  return (data.potholes || []).map((p: any) => ({
    ...p,
    lat: p.location.coordinates[1],
    lng: p.location.coordinates[0],
  }));
};

export const fetchAlerts = async () => {
  // We'll get alerts from socket, but for initial list we can call a mock or a separate endpoint
  // For now, return mock alerts (or we could store alerts in DB)
  // We'll keep the mock for now, but we can later add an endpoint.
  return new Promise((resolve) => {
    setTimeout(() => resolve([
      { id: 'a1', message: 'Vibration spike — SENSOR-2214', timestamp: new Date(Date.now() - 2*60000).toISOString(), type: 'vibration', severity: 'critical' },
      { id: 'a2', message: 'New depth reading — SENSOR-0932', timestamp: new Date(Date.now() - 14*60000).toISOString(), type: 'depth', severity: 'warning' },
      // ...
    ]), 300);
  });
};

export const fetchCrews = async () => {
  const res = await fetch(`${API_URL}/crews`);
  if (!res.ok) throw new Error('Failed to fetch crews');
  return res.json();
};

export const fetchStats = async () => {
  const res = await fetch(`${API_URL}/potholes/stats`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
};

export const updatePotholeStatus = async (id: string, status: string) => {
  const res = await fetch(`${API_URL}/potholes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update');
  return res.json();
};

export const assignCrew = async (id: string, crewName: string) => {
  const res = await fetch(`${API_URL}/potholes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ assignedCrew: crewName }),
  });
  if (!res.ok) throw new Error('Failed to assign crew');
  return res.json();
};
