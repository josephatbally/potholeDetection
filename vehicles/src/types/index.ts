
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
}

export interface Report {
  id: string;
  location: string;
  sensorId?: string;
  depth?: number;
  confirms: number;
  distance: number;
  status?: "detected" | "in_progress" | "repaired";
  severity: "minor" | "moderate" | "severe";
}
