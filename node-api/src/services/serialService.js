const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const Sensor = require('../models/Sensor');
const Pothole = require('../models/Pothole');
const Notification = require('../models/Notification');
const { findNearbyPothole } = require('./deduplicationService');
const { sendAlert, sendPotholeUpdate } = require('./alertService');

const DEFAULT_PORT = process.platform === 'win32' ? 'COM3' : '/dev/ttyUSB0';
const SERIAL_PORT = process.env.SERIAL_PORT || DEFAULT_PORT;
const BAUD_RATE = 9600;
const SENSOR_ID = process.env.SENSOR_ID || 'SENSOR-ARDUINO-01';
const VEHICLE_NAME = process.env.VEHICLE_NAME || 'Arduino Test Vehicle';
const MOCK_SENSOR = process.env.MOCK_SENSOR === 'true';

let port = null;
let parser = null;
let retryTimer = null;
let isOpening = false;
let mockInterval = null;

async function listPorts() {
  try {
    const ports = await SerialPort.list();
    console.log('Available serial ports:');
    ports.forEach(p => console.log(`  ${p.path} - ${p.manufacturer || 'Unknown'}`));
    return ports;
  } catch (err) {
    console.error('Error listing ports:', err.message);
    return [];
  }
}

function startSerialListener() {
  if (MOCK_SENSOR) {
    console.log('🔁 MOCK SENSOR MODE ENABLED – generating fake sensor data every 3s');
    if (mockInterval) clearInterval(mockInterval);
    mockInterval = setInterval(async () => {
      const distance = 20 + Math.random() * 20;
      const potholeFlag = distance > 30 ? 1 : 0;
      const depth = Math.max(0, distance - 30);
      let severity = 'minor';
      if (depth > 5) severity = 'moderate';
      if (depth > 10) severity = 'severe';

      console.log(`Mock: distance=${distance.toFixed(1)}cm, pothole=${potholeFlag}, depth=${depth.toFixed(1)}cm`);

      if (potholeFlag === 1) {
        const lat = -6.7924 + (Math.random() - 0.5) * 0.01;
        const lng = 39.2083 + (Math.random() - 0.5) * 0.01;

        const existing = await findNearbyPothole(lat, lng, 20);
        if (existing) {
          const updated = await Pothole.findByIdAndUpdate(
            existing._id,
            {
              $set: {
                depth,
                severity,
                sensorScore: Math.min(100, (existing.sensorScore || 0) + 5),
                updatedAt: new Date(),
              },
            },
            { new: true }
          );
          sendPotholeUpdate(updated);
          sendAlert('depth', `Mock sensor updated pothole ${updated._id}`, { potholeId: updated._id });
          console.log(`Updated mock pothole ${updated._id}`);
        } else {
          const newPothole = new Pothole({
            location: { type: 'Point', coordinates: [lng, lat] },
            severity,
            depth,
            sensorId: SENSOR_ID,
            source: 'sensor',
            sensorScore: 50,
            status: 'detected',
          });
          await newPothole.save();
          sendPotholeUpdate(newPothole);
          sendAlert('vibration', `Mock sensor detected new pothole`, { potholeId: newPothole._id });

          const notification = new Notification({
            title: '🚧 Mock Pothole Detected',
            message: `A pothole (depth ${depth.toFixed(1)}cm, severity: ${severity}) has been detected.`,
            type: 'road_closed',
            target: 'citizens',
            relatedPothole: newPothole._id,
          });
          await notification.save();
          // ✅ FIX: send message as string, extra data in third argument
          sendAlert('notification', notification.message, {
            title: notification.title,
            type: notification.type,
            notificationId: notification._id,
            createdAt: notification.createdAt,
          });
          console.log(`✅ Created mock pothole ${newPothole._id}`);
        }
      }
    }, 3000);
    return;
  }

  if (isOpening) return;
  isOpening = true;

  console.log(`Attempting to open serial port ${SERIAL_PORT} at ${BAUD_RATE} baud`);

  try {
    port = new SerialPort({
      path: SERIAL_PORT,
      baudRate: BAUD_RATE,
      autoOpen: false,
    });

    parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

    port.open((err) => {
      isOpening = false;
      if (err) {
        console.error('Error opening serial port:', err.message);
        listPorts().then(() => {
          console.log(`Please set SERIAL_PORT in .env to the correct port. Retrying in 15s...`);
          retryTimer = setTimeout(startSerialListener, 15000);
        });
        return;
      }
      console.log(`✅ Serial port ${SERIAL_PORT} opened successfully`);
    });

    parser.on('data', async (line) => {
      line = line.trim();
      if (!line) return;
      console.log('Raw serial:', line);

      const parts = line.split(',');
      if (parts.length < 2) return;

      const distance = parseFloat(parts[0]);
      const potholeFlag = parseInt(parts[1]);

      if (distance < 0) return;

      const depth = Math.max(0, distance - 30);
      let severity = 'minor';
      if (depth > 5) severity = 'moderate';
      if (depth > 10) severity = 'severe';

      if (potholeFlag === 1) {
        const lat = -6.7924;
        const lng = 39.2083;

        const existing = await findNearbyPothole(lat, lng, 20);
        if (existing) {
          const updated = await Pothole.findByIdAndUpdate(
            existing._id,
            {
              $set: {
                depth,
                severity,
                sensorScore: Math.min(100, (existing.sensorScore || 0) + 5),
                updatedAt: new Date(),
              },
            },
            { new: true }
          );
          sendPotholeUpdate(updated);
          sendAlert('depth', `Sensor ${SENSOR_ID} updated pothole ${updated._id}`, { potholeId: updated._id });
          console.log(`Updated pothole ${updated._id}`);
        } else {
          const newPothole = new Pothole({
            location: { type: 'Point', coordinates: [lng, lat] },
            severity,
            depth,
            sensorId: SENSOR_ID,
            source: 'sensor',
            sensorScore: 50,
            status: 'detected',
          });
          await newPothole.save();
          sendPotholeUpdate(newPothole);
          sendAlert('vibration', `New pothole detected by ${SENSOR_ID}`, { potholeId: newPothole._id });

          const notification = new Notification({
            title: '🚧 New Pothole Detected',
            message: `A pothole (depth ${depth.toFixed(1)}cm, severity: ${severity}) has been detected. Please drive carefully.`,
            type: 'road_closed',
            target: 'citizens',
            relatedPothole: newPothole._id,
          });
          await notification.save();
          // ✅ FIX: send message as string, extra data in third argument
          sendAlert('notification', notification.message, {
            title: notification.title,
            type: notification.type,
            notificationId: notification._id,
            createdAt: notification.createdAt,
          });
          console.log(`✅ Created new pothole ${newPothole._id} and sent notification`);
        }
      }

      await Sensor.findOneAndUpdate(
        { sensorId: SENSOR_ID },
        {
          $set: {
            lastReading: new Date(),
            status: 'online',
          },
          $setOnInsert: { vehicle: VEHICLE_NAME },
        },
        { upsert: true }
      );
    });

    port.on('error', (err) => {
      console.error('Serial port error:', err.message);
      if (!port?.isOpen) {
        clearTimeout(retryTimer);
        retryTimer = setTimeout(startSerialListener, 15000);
      }
    });

    port.on('close', () => {
      console.log('Serial port closed. Reopening in 15s...');
      clearTimeout(retryTimer);
      retryTimer = setTimeout(startSerialListener, 15000);
    });

  } catch (error) {
    isOpening = false;
    console.error('Failed to start serial listener:', error.message);
    clearTimeout(retryTimer);
    retryTimer = setTimeout(startSerialListener, 15000);
  }
}

function stopSerialListener() {
  clearTimeout(retryTimer);
  if (mockInterval) clearInterval(mockInterval);
  if (parser) {
    parser.removeAllListeners();
    parser = null;
  }
  if (port) {
    port.close((err) => {
      if (err) console.error('Error closing port:', err.message);
      else console.log('Serial port closed');
    });
    port = null;
  }
}

module.exports = { startSerialListener, stopSerialListener };
