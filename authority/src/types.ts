export interface Pothole {
  id: string;
  lat: number;
  lng: number;
  severity: "minor" | "moderate" | "severe";
  detectedAt: string;
  status: "detected" | "in_progress" | "repaired";
  depth?: number;
  sensorId?: string;
  citizenReports?: number;
  source: "sensor" | "citizen" | "both";
  assignedCrew?: string;
  sensorScore?: number;
}

export interface Alert {
  id: string;
  message: string;
  timestamp: string;
  type: "vibration" | "depth" | "repair" | "citizen" | "battery";
  severity?: "info" | "warning" | "critical";
}

export interface Crew {
  id: string;
  name: string;
  status: "available" | "on_route" | "on_site";
}

export interface ReportQueueItem extends Pothole {
  locationName: string;
  sensorScore: number;
  sourceLabel: string;
  assignedCrewName?: string;
}
