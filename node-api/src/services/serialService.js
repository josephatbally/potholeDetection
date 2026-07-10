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

let port = null;
let parser = null;
let retryTimer = null;
let isOpening = false;

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
          console.log(`Please set SERIAL_PORT in .env to the correct port. Retrying in 10s...`);
          retryTimer = setTimeout(startSerialListener, 10000);
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

      const depth = Math.max(0, 30 - distance);
      let severity = 'minor';
      if (depth > 5) severity = 'moderate';
      if (depth > 10) severity = 'severe';

      if (potholeFlag === 1) {
        const lat = -6.7924;
        const lng = 39.2083;

        const existing = await findNearbyPothole(lat, lng, 20);
        if (existing) {
          // Update existing pothole
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
          // Create new pothole
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

          // ✅ Create a notification for citizens (road closure/alert)
          const notification = new Notification({
            title: '🚧 New Pothole Detected',
            message: `A pothole (depth ${depth.toFixed(1)}cm, severity: ${severity}) has been detected near Dar es Salaam. Please drive carefully.`,
            type: 'road_closed',  // or 'alert'
            target: 'citizens',
            relatedPothole: newPothole._id,
          });
          await notification.save();

          // Emit notification via Socket.IO
          sendAlert('notification', {
            title: notification.title,
            message: notification.message,
            type: notification.type,
            notificationId: notification._id,
            createdAt: notification.createdAt,
          });

          console.log(`✅ Created new pothole ${newPothole._id} and sent notification`);
        }
      }

      // Update sensor status
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
        retryTimer = setTimeout(startSerialListener, 5000);
      }
    });

    port.on('close', () => {
      console.log('Serial port closed. Reopening in 5s...');
      clearTimeout(retryTimer);
      retryTimer = setTimeout(startSerialListener, 5000);
    });

  } catch (error) {
    isOpening = false;
    console.error('Failed to start serial listener:', error.message);
    clearTimeout(retryTimer);
    retryTimer = setTimeout(startSerialListener, 5000);
  }
}

function stopSerialListener() {
  clearTimeout(retryTimer);
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
