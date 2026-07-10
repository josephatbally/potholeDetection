import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifType, setNotifType] = useState('info');
  const [notifTarget, setNotifTarget] = useState('all');
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState('');

  const sendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle || !notifMessage) {
      setFeedback('Title and message are required');
      return;
    }
    setSending(true);
    try {
      const res = await fetch('http://localhost:5000/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: notifTitle,
          message: notifMessage,
          type: notifType,
          target: notifTarget,
        }),
      });
      if (!res.ok) throw new Error('Failed to send');
      setFeedback('Notification sent successfully!');
      setNotifTitle('');
      setNotifMessage('');
    } catch (err) {
      setFeedback('Error sending notification');
    } finally {
      setSending(false);
    }
  };

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
            }}
          >
            {theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
          </button>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
          Current theme: <strong>{theme}</strong>
        </p>
      </div>

      <div style={{ marginTop: '24px', backgroundColor: 'var(--bg-secondary)', padding: '20px', borderRadius: '8px', boxShadow: 'var(--shadow)', maxWidth: '600px' }}>
        <h3>Send Notification</h3>
        <form onSubmit={sendNotification}>
          <div style={{ marginBottom: '12px' }}>
            <label>Title</label>
            <input
              type="text"
              value={notifTitle}
              onChange={(e) => setNotifTitle(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label>Message</label>
            <textarea
              value={notifMessage}
              onChange={(e) => setNotifMessage(e.target.value)}
              rows={3}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '12px' }}>
            <div>
              <label>Type</label>
              <select value={notifType} onChange={(e) => setNotifType(e.target.value)} style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="alert">Alert</option>
              </select>
            </div>
            <div>
              <label>Target</label>
              <select value={notifTarget} onChange={(e) => setNotifTarget(e.target.value)} style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}>
                <option value="all">All</option>
                <option value="citizens">Citizens</option>
                <option value="authorities">Authorities</option>
              </select>
            </div>
          </div>
          <button type="submit" disabled={sending} style={{ padding: '8px 20px', borderRadius: '4px', border: 'none', backgroundColor: '#2196f3', color: 'white', cursor: 'pointer' }}>
            {sending ? 'Sending...' : 'Send Notification'}
          </button>
          {feedback && <p style={{ marginTop: '8px' }}>{feedback}</p>}
        </form>
      </div>
    </div>
  );
};
export default Settings;
