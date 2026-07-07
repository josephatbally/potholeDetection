import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', overflow: 'hidden' }}>
      <Sidebar />
      <div style={{
        flex: 1,
        padding: '24px',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        transition: 'background 0.3s, color 0.3s',
      }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
