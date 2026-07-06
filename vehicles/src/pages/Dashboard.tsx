import React from 'react';
import { usePotholes } from '../hooks/usePotholes';
import { useReports } from '../hooks/useReports';
import Map from '../components/Map';
import ReportsList from '../components/ReportsList';

const Dashboard: React.FC = () => {
  const { potholes, loading: pLoading, error: pError } = usePotholes();
  const { reports, loading: rLoading, error: rError } = useReports();

  if (pLoading || rLoading) return <div>Loading dashboard...</div>;
  if (pError || rError) return <div>Error: {pError || rError}</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ borderBottom: '2px solid #333', paddingBottom: '10px', marginBottom: '20px' }}>
        <h1 style={{ margin: 0, fontSize: '1.8rem' }}>RoadWatch</h1>
        <p style={{ color: '#555', margin: '4px 0 0' }}>
          CITIZEN WEB DASHBOARD — Watch the live map and see potholes near you.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div>
          <Map potholes={potholes} />
          <div
            style={{
              display: 'flex',
              gap: '16px',
              marginTop: '8px',
              fontSize: '0.85rem',
              flexWrap: 'wrap',
            }}
          >
            <span>
              <span
                style={{
                  display: 'inline-block',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: '#f44336',
                  marginRight: '4px',
                }}
              ></span>
              Severe
            </span>
            <span>
              <span
                style={{
                  display: 'inline-block',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: '#ff9800',
                  marginRight: '4px',
                }}
              ></span>
              Moderate
            </span>
            <span>
              <span
                style={{
                  display: 'inline-block',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: '#2196f3',
                  marginRight: '4px',
                }}
              ></span>
              Recently fixed
            </span>
            <span>
              <span
                style={{
                  display: 'inline-block',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: '#9c27b0',
                  marginRight: '4px',
                }}
              ></span>
              Crew on site
            </span>
          </div>
        </div>
        <div>
          <ReportsList reports={reports} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
