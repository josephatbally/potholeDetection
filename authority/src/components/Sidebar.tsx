import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const menuItems = [
    { path: '/', label: 'Overview' },
    { path: '/map', label: 'Live Map' },
    { path: '/reports', label: 'Report Queue' },
    { path: '/sensors', label: 'Sensor Network' },
    { path: '/crews', label: 'Repair Crews' },
    { path: '/analytics', label: 'Analytics' },
    { path: '/notifications', label: 'Notifications' },
    { path: '/settings', label: 'Settings' },
  ];

  return (
    <div className="sidebar" style={{ width: '220px', height: '100vh', padding: '20px 0', position: 'sticky', top: 0, flexShrink: 0, overflowY: 'auto' }}>
      <div style={{ padding: '0 20px', marginBottom: '30px' }}>
        <h2 style={{ margin: 0, fontWeight: 300 }}>RoadWatch</h2>
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {menuItems.map((item) => (
          <li key={item.path}>
            <NavLink to={item.path} className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default Sidebar;
