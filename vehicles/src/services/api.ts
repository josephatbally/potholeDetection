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

export const fetchStats = async () => {
  const res = await fetch(`${API_URL}/potholes/stats`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
};
