import React from 'react';
import { ReportQueueItem } from '../types';

interface ReportsQueueTableProps {
  items: ReportQueueItem[];
  onStatusChange: (id: string, status: string) => void;
  onAssignCrew: (id: string, crew: string) => void;
  crews: string[];
}

const ReportsQueueTable: React.FC<ReportsQueueTableProps> = ({ items, onStatusChange, onAssignCrew, crews }) => {
  return (
    <div style={{ overflowX: 'auto', maxHeight: '400px', overflowY: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
        <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f2f2f2', zIndex: 1 }}>
          <tr>
            <th style={{ padding: '8px', textAlign: 'left' }}>ID</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>Location</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>Sensor Score</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>Source</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>Status</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>Assigned Crew</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '8px' }}>{item.id}</td>
              <td style={{ padding: '8px' }}>{item.locationName}</td>
              <td style={{ padding: '8px', fontWeight: item.sensorScore > 80 ? 'bold' : 'normal', color: item.sensorScore > 80 ? '#f44336' : item.sensorScore > 50 ? '#ff9800' : '#4caf50' }}>
                {item.sensorScore}
              </td>
              <td style={{ padding: '8px' }}>{item.sourceLabel}</td>
              <td style={{ padding: '8px' }}>
                <select
                  value={item.status}
                  onChange={(e) => onStatusChange(item.id, e.target.value)}
                  style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                  <option value="detected">New</option>
                  <option value="in_progress">In Progress</option>
                  <option value="repaired">Repaired</option>
                </select>
              </td>
              <td style={{ padding: '8px' }}>
                <select
                  value={item.assignedCrewName || 'Unassigned'}
                  onChange={(e) => onAssignCrew(item.id, e.target.value)}
                  style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                  <option value="Unassigned">Unassigned</option>
                  {crews.map((crew) => (
                    <option key={crew} value={crew}>{crew}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportsQueueTable;
