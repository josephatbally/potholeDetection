import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Pothole } from '../types';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const getMarkerIcon = (severity: Pothole['severity'], status: Pothole['status']) => {
  let color = '#4caf50';
  if (severity === 'moderate') color = '#ff9800';
  if (severity === 'severe') color = '#f44336';
  if (status === 'repaired') color = '#2196f3';
  if (status === 'in_progress') color = '#9c27b0';
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color:${color}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

interface MapProps {
  potholes: Pothole[];
}

const Map: React.FC<MapProps> = ({ potholes }) => {
  const center: [number, number] = potholes.length > 0 ? [potholes[0].lat, potholes[0].lng] : [-6.7924, 39.2083];
  return (
    <div style={{ height: '100%', width: '100%', minHeight: '200px' }}>
      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {potholes.map((p) => (
          <Marker key={p.id} position={[p.lat, p.lng]} icon={getMarkerIcon(p.severity, p.status)}>
            <Popup>{p.id}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
