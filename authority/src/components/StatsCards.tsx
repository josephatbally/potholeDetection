import React from 'react';

interface Stats {
  open: number;
  newToday: number;
  avgRepairTime: number;
  sensorUptime: number;
  crewsActive: number;
  totalCrews: number;
}

interface StatsCardsProps {
  stats: Stats;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const cards = [
    { label: 'Open Potholes', value: stats.open, sub: `${stats.newToday} new today` },
    { label: 'Avg Repair Time', value: `${stats.avgRepairTime}d`, sub: `0.6d vs last month` },
    { label: 'Sensor Uptime', value: `${stats.sensorUptime}%`, sub: `312 / 310 online` },
    { label: 'Crews Active', value: stats.crewsActive, sub: `of ${stats.totalCrews} registered` },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: '16px',
      marginBottom: '20px',
    }}>
      {cards.map((card) => (
        <div key={card.label} style={{ backgroundColor: '#f5f5f5', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{card.value}</div>
          <div style={{ fontSize: '14px', color: '#555' }}>{card.label}</div>
          <div style={{ fontSize: '12px', color: '#888' }}>{card.sub}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
