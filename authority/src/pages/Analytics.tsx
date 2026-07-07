import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const Analytics: React.FC = () => {
  const severityData = [
    { name: 'Minor', value: 25 },
    { name: 'Moderate', value: 45 },
    { name: 'Severe', value: 30 },
  ];
  const COLORS = ['#4caf50', '#ff9800', '#f44336'];

  const monthlyData = [
    { month: 'Jan', detected: 12, repaired: 8 },
    { month: 'Feb', detected: 18, repaired: 14 },
    { month: 'Mar', detected: 15, repaired: 12 },
    { month: 'Apr', detected: 22, repaired: 18 },
    { month: 'May', detected: 28, repaired: 20 },
    { month: 'Jun', detected: 20, repaired: 22 },
  ];

  const repairTimeData = [
    { crew: 'Crew 01', avgDays: 2.5 },
    { crew: 'Crew 02', avgDays: 3.2 },
    { crew: 'Crew 03', avgDays: 1.8 },
    { crew: 'Crew 04', avgDays: 4.0 },
  ];

  return (
    <div>
      <h1 style={{ marginTop: 0, fontWeight: 300 }}>Analytics</h1>
      <p style={{ color: 'var(--text-secondary)' }}>Visual insights into pothole detection and repair.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '20px' }}>
        <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px', boxShadow: 'var(--shadow)' }}>
          <h3>Severity Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={severityData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {severityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px', boxShadow: 'var(--shadow)' }}>
          <h3>Monthly Trends</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="detected" stroke="#f44336" />
              <Line type="monotone" dataKey="repaired" stroke="#4caf50" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '16px', borderRadius: '8px', boxShadow: 'var(--shadow)', gridColumn: '1 / -1' }}>
          <h3>Average Repair Time by Crew</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={repairTimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="crew" />
              <YAxis label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Bar dataKey="avgDays" fill="#2196f3" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
