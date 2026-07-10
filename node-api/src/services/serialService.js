const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const Sensor = require('../models/Sensor');
const Pothole = require('../models/Pothole');
const { findNearbyPothole } = require('./deduplicationService');
const { sendAlert, sendPotholeUpdate } = require('./alertService');

// Configuration – adjust these to match your setup
const SERIAL_PORT = process.env.SERIAL_PORT || 'COM3';      // Windows: COM3, Linux: /dev/ttyUSB0
const BAUD_RATE = 9600;
const SENSOR_ID = process.env.SENSOR_ID || 'SENSOR-ARDUINO-01';
const VEHICLE_NAME = process.env.VEHICLE_NAME || 'Arduino Test Vehicle';

let port = null;
let parser = null;

function startSerialListener() {
  console.log(`Starting serial listener on ${SERIAL_PORT} at ${BAUD_RATE} baud`);

  try {
    port = new SerialPort({
      path: SERIAL_PORT,
      baudRate: BAUD_RATE,
      autoOpen: false,
    });

    parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

    port.open((err) => {
      if (err) {
        console.error('Error opening serial port:', err.message);
        // Retry after 5 seconds
        setTimeout(startSerialListener, 5000);
        return;
      }
      console.log(`Serial port ${SERIAL_PORT} opened successfully`);
    });

    parser.on('data', async (line) => {
      line = line.trim();
      if (!line) return;
      console.log('Raw serial:', line);

      // Expected format: "distance,pothole"   e.g. "25.4,1" or "-1,0"
      const parts = line.split(',');
      if (parts.length < 2) return;

      const distance = parseFloat(parts[0]);
      const potholeFlag = parseInt(parts[1]);

      // Ignore invalid readings (distance = -1)
      if (distance < 0) return;

      // Map distance to depth (depth = distance from sensor to road?)
      // Assuming sensor is mounted 30cm above road, pothole depth = 30 - distance (if > 0)
      const depth = Math.max(0, 30 - distance); // in cm

      // Determine severity based on depth
      let severity = 'minor';
      if (depth > 5) severity = 'moderate';
      if (depth > 10) severity = 'severe';

      // If pothole flag is 1, we have a pothole
      if (potholeFlag === 1) {
        // Use the current location – for demo we use a fixed coordinate.
        // In real deployment you would have GPS module – we can mock or pass via serial.
        // For now, we use a fixed location near Dar es Salaam.
        const lat = -6.7924;
        const lng = 39.2083;

        // Check for existing pothole nearby
        const existing = await findNearbyPothole(lat, lng, 20);
        if (existing) {
          // Update existing pothole with new depth/severity
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
            location: {
              type: 'Point',
              coordinates: [lng, lat],
            },
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
          console.log(`Created new pothole ${newPothole._id}`);
        }
      }

      // Update sensor status (last reading, battery, etc.)
      await Sensor.findOneAndUpdate(
        { sensorId: SENSOR_ID },
        {
          $set: {
            lastReading: new Date(),
            status: 'online',
            // battery: we can add a fixed value or parse from serial if sent
          },
          $setOnInsert: { vehicle: VEHICLE_NAME },
        },
        { upsert: true }
      );
    });

    port.on('error', (err) => {
      console.error('Serial port error:', err.message);
      // Attempt to reopen after error
      setTimeout(startSerialListener, 5000);
    });

    port.on('close', () => {
      console.log('Serial port closed. Reopening in 5s...');
      setTimeout(startSerialListener, 5000);
    });

  } catch (error) {
    console.error('Failed to start serial listener:', error.message);
    setTimeout(startSerialListener, 5000);
  }
}

function stopSerialListener() {
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
