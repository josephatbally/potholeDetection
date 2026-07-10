export interface Pothole {
  id: string;
  lat: number;
  lng: number;
  severity: 'minor' | 'moderate' | 'severe';
  detectedAt: string;
  status: 'detected' | 'in_progress' | 'repaired';
  depth?: number;
  sensorId?: string;
  citizenReports?: number;
  source: 'sensor' | 'citizen' | 'both';
  locationName?: string;
}

export interface Report {
  id: string;
  location: string;
  sensorId?: string;
  depth?: number;
  confirms: number;
  distance: number;
  status?: 'detected' | 'in_progress' | 'repaired';
  severity: 'minor' | 'moderate' | 'severe';
  detectedAt?: string; // for sorting
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'alert' | 'resolved' | 'urgent' | 'success';
  createdAt: string;
  target?: string;
}
