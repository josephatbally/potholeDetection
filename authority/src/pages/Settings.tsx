import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div>
      <h1 style={{ marginTop: 0, fontWeight: 300 }}>Settings</h1>
      <p style={{ color: 'var(--text-secondary)' }}>Customize your dashboard experience.</p>

      <div style={{ marginTop: '24px', backgroundColor: 'var(--bg-secondary)', padding: '20px', borderRadius: '8px', boxShadow: 'var(--shadow)', maxWidth: '500px' }}>
        <h3>Appearance</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
          <span>Theme</span>
          <button
            onClick={toggleTheme}
            style={{
              padding: '8px 20px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: theme === 'light' ? '#333' : '#eee',
              color: theme === 'light' ? 'white' : '#333',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'background 0.3s',
            }}
          >
            {theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
          </button>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
          Current theme: <strong>{theme}</strong>
        </p>
      </div>

      <div style={{ marginTop: '24px', backgroundColor: 'var(--bg-secondary)', padding: '20px', borderRadius: '8px', boxShadow: 'var(--shadow)', maxWidth: '500px' }}>
        <h3>Preferences</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
          <span>Notifications</span>
          <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '26px' }}>
            <input type="checkbox" defaultChecked style={{ opacity: 0, width: 0, height: 0 }} />
            <span style={{
              position: 'absolute',
              cursor: 'pointer',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#ccc',
              transition: '0.4s',
              borderRadius: '26px',
            }}>
              <span style={{
                position: 'absolute',
                content: '',
                height: '20px',
                width: '20px',
                left: '3px',
                bottom: '3px',
                backgroundColor: 'white',
                transition: '0.4s',
                borderRadius: '50%',
                transform: 'translateX(24px)',
              }} />
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Settings;
