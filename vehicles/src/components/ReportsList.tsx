import React from 'react';
import { Report } from '../types';

interface ReportsListProps {
  reports: Report[];
}

const ReportsList: React.FC<ReportsListProps> = ({ reports }) => {
  if (reports.length === 0) {
    return <p style={{ color: '#888' }}>No reports nearby.</p>;
  }

  return (
    <div>
      <h3 style={{ marginTop: 0, borderBottom: '1px solid #ddd', paddingBottom: '8px' }}>
        Reports Near You
      </h3>
      {reports.map((r) => (
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
              {r.depth !== undefined && r.depth > 0 && (
                <span>depth {r.depth}cm</span>
              )}
              {r.confirms > 0 && (
                <span style={{ marginLeft: '8px' }}>
                  - {r.confirms} confirm{r.confirms > 1 ? 's' : ''}
                </span>
              )}
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
      ))}
    </div>
  );
};

export default ReportsList;
