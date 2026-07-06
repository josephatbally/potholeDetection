import { Pothole, Report } from '../types/index.js';

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
  },
  {
    id: 'PH-1035',
    lat: -6.79,
    lng: 39.23,
    severity: 'minor',
    detectedAt: new Date(Date.now() - 24*60*60000).toISOString(),
    status: 'detected',
    depth: 4.4,
    sensorId: 'SENSOR-0774',
    citizenReports: 10,
    source: 'both',
  },
];

export const fetchNearbyReports = (): Promise<Report[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'PH-1042',
          location: 'Morogoro Rd & Kawawa',
          sensorId: 'SENSOR-2214',
          depth: 6.3,
          confirms: 24,
          distance: 0.4,
          severity: 'severe',
          status: 'detected',
        },
        {
          id: 'PH-1039',
          location: 'Bagamoyo Rd, near market',
          sensorId: 'SENSOR-2217',
          depth: 3.8,
          confirms: 1,
          distance: 0.9,
          severity: 'moderate',
          status: 'in_progress',
        },
        {
          id: 'PH-1033',
          location: 'Sam Nujoma Rd',
          sensorId: undefined,
          depth: 0,
          confirms: 5,
          distance: 2.1,
          severity: 'minor',
          status: 'repaired',
        },
        {
          id: 'PH-1036',
          location: 'Uhuru Rd, near stadium',
          sensorId: undefined,
          depth: undefined,
          confirms: 5,
          distance: 2.8,
          severity: 'minor',
          status: 'detected',
        },
        {
          id: 'PH-1041',
          location: 'All Hassan Mwinyi Rd',
          sensorId: 'SENSOR-2212',
          depth: 5.1,
          confirms: 37,
          distance: 1.6,
          severity: 'moderate',
          status: 'in_progress',
        },
        {
          id: 'PH-1035',
          location: 'Kawawa Rd flyover',
          sensorId: 'SENSOR-0774',
          depth: 4.4,
          confirms: 10,
          distance: 3.2,
          severity: 'moderate',
          status: 'detected',
        },
      ]);
    }, 300);
  });
};

export const fetchPotholes = (): Promise<Pothole[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockPotholes), 300);
  });
};
