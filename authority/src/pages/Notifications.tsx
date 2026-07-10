import React, { useState, useEffect } from 'react';
import { socketService } from '../services/socket';

const Notifications: React.FC = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('general');
  const [severity, setSeverity] = useState('info');
  const [area, setArea] = useState('');
  const [sending, setSending] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const sendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) {
      setStatusMsg('Title and message are required');
      return;
    }
    setSending(true);
    try {
      const res = await fetch(`${API_URL}/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, message, type, severity, area }),
      });
      if (!res.ok) throw new Error('Failed to send');
      setStatusMsg('Notification sent successfully!');
      setTitle('');
      setMessage('');
      setArea('');
    } catch (err) {
      setStatusMsg('Error sending notification');
    } finally {
      setSending(false);
      setTimeout(() => setStatusMsg(''), 5000);
    }
  };

  return (
    <div>
      <h1 style={{ marginTop: 0, fontWeight: 300 }}>Send Notification</h1>
      <p style={{ color: 'var(--text-secondary)' }}>Broadcast alerts to all citizens (vehicles app).</p>
      <form onSubmit={sendNotification} style={{ backgroundColor: 'var(--bg-secondary)', padding: '20px', borderRadius: '8px', boxShadow: 'var(--shadow)', maxWidth: '600px' }}>
        <div style={{ marginBottom: '12px' }}>
          <label>Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} required />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label>Message</label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} required />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label>Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
              <option value="general">General</option>
              <option value="road_closed">Road Closed</option>
              <option value="accident">Accident</option>
              <option value="maintenance">Maintenance</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          <div>
            <label>Severity</label>
            <select value={severity} onChange={(e) => setSeverity(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>
        <div style={{ marginBottom: '12px', marginTop: '12px' }}>
          <label>Area (optional)</label>
          <input type="text" value={area} onChange={(e) => setArea(e.target.value)} placeholder="e.g., Morogoro Rd" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
        </div>
        <button type="submit" disabled={sending} style={{ padding: '8px 20px', backgroundColor: '#2196f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {sending ? 'Sending...' : 'Send Notification'}
        </button>
        {statusMsg && <p style={{ marginTop: '12px' }}>{statusMsg}</p>}
      </form>
    </div>
  );
};
export default Notifications;
