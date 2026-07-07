import { Pothole, Alert, Crew, ReportQueueItem } from '../types';

const mockPotholes: Pothole[] = [
  {
    id: 'PH-1042',
    lat: -6.7924,
    lng: 39.2083,
    severity: 'severe',
    detectedAt: new Date(Date.now() - 2*60000).toISOString(),
    status: 'detected',
    depth: 6.3,
    sensorId: 'SENSOR-2214',
    citizenReports: 24,
    source: 'both',
    sensorScore: 91,
  },
  {
    id: 'PH-1041',
    lat: -6.8,
    lng: 39.22,
    severity: 'moderate',
    detectedAt: new Date(Date.now() - 14*60000).toISOString(),
    status: 'in_progress',
    depth: 5.1,
    sensorId: 'SENSOR-2212',
    citizenReports: 37,
    source: 'both',
    sensorScore: 84,
    assignedCrew: 'Crew 04 — Juma',
  },
  {
    id: 'PH-1039',
    lat: -6.81,
    lng: 39.21,
    severity: 'moderate',
    detectedAt: new Date(Date.now() - 60*60000).toISOString(),
    status: 'in_progress',
    depth: 3.8,
    sensorId: 'SENSOR-2217',
    citizenReports: 11,
    source: 'both',
    sensorScore: 67,
    assignedCrew: 'Crew 02 — Neema',
  },
  {
    id: 'PH-1033',
    lat: -6.78,
    lng: 39.19,
    severity: 'minor',
    detectedAt: new Date(Date.now() - 2*24*60*60000).toISOString(),
    status: 'repaired',
    depth: 0,
    sensorId: undefined,
    citizenReports: 5,
    source: 'citizen',
    sensorScore: 45,
    assignedCrew: 'Crew 01 — Baraka',
  },
];

const mockAlerts: Alert[] = [
  { id: 'a1', message: 'Vibration spike — SENSOR-2214', timestamp: new Date(Date.now() - 2*60000).toISOString(), type: 'vibration', severity: 'critical' },
  { id: 'a2', message: 'New depth reading — SENSOR-0932', timestamp: new Date(Date.now() - 14*60000).toISOString(), type: 'depth', severity: 'warning' },
  { id: 'a3', message: 'Crew marked repair complete', timestamp: new Date(Date.now() - 60*60000).toISOString(), type: 'repair', severity: 'info' },
  { id: 'a4', message: '23 citizen confirms threshold hit', timestamp: new Date(Date.now() - 2*60000).toISOString(), type: 'citizen', severity: 'warning' },
  { id: 'a5', message: 'Sensor battery low — SENSOR-1187', timestamp: new Date(Date.now() - 3*60000).toISOString(), type: 'battery', severity: 'critical' },
];

const mockCrews: Crew[] = [
  { id: '1', name: 'Crew 01 — Baraka', status: 'on_site' },
  { id: '2', name: 'Crew 02 — Neema', status: 'on_site' },
  { id: '3', name: 'Crew 03 — Peter', status: 'available' },
  { id: '4', name: 'Crew 04 — Juma', status: 'on_route' },
];

export const fetchPotholes = (): Promise<Pothole[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(mockPotholes), 300));
};

export const fetchAlerts = (): Promise<Alert[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(mockAlerts), 300));
};

export const fetchCrews = (): Promise<Crew[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(mockCrews), 300));
};

export const fetchStats = (): Promise<{ open: number; newToday: number; avgRepairTime: number; sensorUptime: number; crewsActive: number; totalCrews: number }> => {
  return new Promise((resolve) => {
    resolve({
      open: 142,
      newToday: 12,
      avgRepairTime: 4.2,
      sensorUptime: 98.6,
      crewsActive: 9,
      totalCrews: 14,
    });
  });
};

export const updatePotholeStatus = (id: string, status: Pothole['status']): Promise<Pothole> => {
  const pothole = mockPotholes.find((p) => p.id === id);
  if (!pothole) throw new Error('Pothole not found');
  pothole.status = status;
  return Promise.resolve(pothole);
};

export const assignCrew = (potholeId: string, crewName: string): Promise<Pothole> => {
  const pothole = mockPotholes.find((p) => p.id === potholeId);
  if (!pothole) throw new Error('Pothole not found');
  pothole.assignedCrew = crewName;
  return Promise.resolve(pothole);
};

export const fetchQueueItems = (): Promise<ReportQueueItem[]> => {
  return fetchPotholes().then((potholes) => {
    return potholes.map((p) => ({
      ...p,
      locationName: `${p.lat.toFixed(4)}, ${p.lng.toFixed(4)}`,
      sensorScore: p.sensorScore || 0,
      sourceLabel: p.source === 'sensor' ? 'Sensor' : p.source === 'citizen' ? 'Citizen' : 'Sensor + citizens',
      assignedCrewName: p.assignedCrew || 'Unassigned',
    }));
  });
};
