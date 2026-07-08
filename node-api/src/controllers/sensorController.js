const Sensor = require('../models/Sensor');
const Pothole = require('../models/Pothole');
const { findNearbyPothole } = require('../services/deduplicationService');
const { sendAlert, sendPotholeUpdate } = require('../services/alertService');

// POST /api/sensors/data
exports.ingestSensorData = async (req, res) => {
  try {
    const { sensorId, location, depth, severity, battery } = req.body;

    // Update sensor status
    await Sensor.findOneAndUpdate(
      { sensorId },
      {
        $set: {
          lastReading: new Date(),
          battery,
          location: { type: 'Point', coordinates: [location.lng, location.lat] },
        },
        $setOnInsert: { vehicle: req.body.vehicle || 'Unknown' },
      },
      { upsert: true, new: true }
    );

    // Check if pothole already exists nearby
    const existing = await findNearbyPothole(location.lat, location.lng, 20);

    if (existing) {
      // Update existing pothole with new sensor data
      const updated = await Pothole.findByIdAndUpdate(
        existing._id,
        {
          $set: {
            depth,
            severity,
            sensorScore: Math.min(100, (existing.sensorScore || 0) + 10),
            updatedAt: new Date(),
          },
          $inc: { citizenReports: 0 }, // no citizen increment
        },
        { new: true }
      );
      sendPotholeUpdate(updated);
      sendAlert('depth', `Sensor ${sensorId} updated pothole ${updated._id}`, { potholeId: updated._id });
      return res.status(200).json({ message: 'Pothole updated', pothole: updated });
    }

    // Create new pothole
    const newPothole = new Pothole({
      location: {
        type: 'Point',
        coordinates: [location.lng, location.lat],
      },
      severity,
      depth,
      sensorId,
      source: 'sensor',
      sensorScore: 50,
      status: 'detected',
    });
    await newPothole.save();
    sendPotholeUpdate(newPothole);
    sendAlert('vibration', `New pothole detected by ${sensorId}`, { potholeId: newPothole._id });

    res.status(201).json({ message: 'New pothole detected', pothole: newPothole });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/sensors/status – get all sensors
exports.getSensors = async (req, res) => {
  try {
    const sensors = await Sensor.find();
    res.json(sensors);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
