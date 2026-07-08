// We'll use the io instance from server.js
let io = null;

const init = (socketIO) => { io = socketIO; };

const sendAlert = (type, message, data = {}) => {
  if (!io) return;
  io.emit('alert', {
    type, // 'vibration', 'depth', 'repair', 'citizen', 'battery'
    message,
    timestamp: new Date().toISOString(),
    data,
  });
};

const sendPotholeUpdate = (pothole) => {
  if (!io) return;
  io.emit('pothole_update', pothole);
};

module.exports = { init, sendAlert, sendPotholeUpdate };
