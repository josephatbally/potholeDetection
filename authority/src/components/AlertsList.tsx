import React from 'react';
import { Alert } from '../types';

interface AlertsListProps {
  alerts: Alert[];
}

const AlertsList: React.FC<AlertsListProps> = ({ alerts }) => {
  return (
    <div style={{
      border: '1px solid #ddd',
      padding: '12px',
      borderRadius: '8px',
      maxHeight: '300px',
      overflowY: 'auto',
      height: '100%',
    }}>
      <h4 style={{ marginTop: 0 }}>Real-Time Alerts</h4>
      {alerts.map((alert) => (
        <div key={alert.id} style={{ borderBottom: '1px solid #eee', padding: '8px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: alert.severity === 'critical' ? 'bold' : 'normal', fontSize: '0.9rem' }}>
              {alert.message}
            </span>
            <span style={{ fontSize: '0.8em', color: '#888' }}>
              {new Date(alert.timestamp).toLocaleTimeString()}
            </span>
          </div>
          {alert.severity && (
            <span style={{ fontSize: '0.8em', color: alert.severity === 'critical' ? '#f44336' : alert.severity === 'warning' ? '#ff9800' : '#4caf50' }}>
              {alert.severity}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default AlertsList;
