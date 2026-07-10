import React from 'react';
import { Report, Notification } from '../types';

interface ReportsListProps {
  reports: Report[];
  notifications?: Notification[];
}

const ReportsList: React.FC<ReportsListProps> = ({ reports, notifications = [] }) => {
  // Combine and sort by time (newest first)
  const combined = [
    ...notifications.map(n => ({
      id: n.id,
      type: 'notification' as const,
      timestamp: n.createdAt,
      data: n,
    })),
    ...reports.map(r => ({
      id: r.id,
      type: 'report' as const,
      timestamp: r.detectedAt || new Date().toISOString(),
      data: r,
    })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  if (combined.length === 0) {
    return <p style={{ color: '#888' }}>No reports nearby.</p>;
  }

  // Color mapping for notification types
  const colorMap: Record<string, string> = {
    info: '#2196f3',
    warning: '#ff9800',
    alert: '#f44336',
    resolved: '#4caf50',
    urgent: '#ff5722',
    success: '#4caf50',
    road_closed: '#9c27b0', // purple for road closed
    general: '#607d8b',
    repair_done: '#4caf50',
  };

  return (
    <div>
      <h3 style={{ marginTop: 0, borderBottom: '1px solid #ddd', paddingBottom: '8px' }}>
        Reports & Notifications
      </h3>
      {combined.map((item) => {
        if (item.type === 'notification') {
          const n = item.data as Notification;
          const bgColor = colorMap[n.type] || '#888';
          return (
            <div
              key={n.id}
              style={{
                borderBottom: '1px solid #eee',
                padding: '12px 0',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '1.05rem' }}>{n.title}</strong>
                <span style={{ fontSize: '0.8rem', color: '#888' }}>
                  {new Date(n.createdAt).toLocaleTimeString()}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                <span style={{ fontSize: '0.9rem', color: '#555' }}>{n.message}</span>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    backgroundColor: bgColor,
                    color: 'white',
                  }}
                >
                  {n.type.replace('_', ' ')}
                </span>
              </div>
            </div>
          );
        } else {
          const r = item.data as Report;
          return (
            <div
              key={r.id}
              style={{
                borderBottom: '1px solid #eee',
                padding: '12px 0',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '1.05rem' }}>{r.location}</strong>
                <span style={{ fontSize: '0.9rem', color: '#888' }}>
                  {r.sensorId && <span style={{ marginRight: '6px' }}>{r.sensorId}</span>}
                  <span>{r.distance} km</span>
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                <div style={{ fontSize: '0.9rem', color: '#555' }}>
                  {r.depth !== undefined && r.depth > 0 && <span>depth {r.depth}cm</span>}
                  {r.confirms > 0 && <span style={{ marginLeft: '8px' }}>- {r.confirms} confirm{r.confirms > 1 ? 's' : ''}</span>}
                </div>
                <div>
                  {r.status && (
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        backgroundColor:
                          r.status === 'repaired'
                            ? '#4caf50'
                            : r.status === 'in_progress'
                            ? '#ff9800'
                            : '#f44336',
                        color: 'white',
                      }}
                    >
                      {r.status}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        }
      })}
    </div>
  );
};

export default ReportsList;
