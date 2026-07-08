const CitizenReport = require('../models/CitizenReport');
const Pothole = require('../models/Pothole');
const { findNearbyPothole } = require('../services/deduplicationService');
const { sendAlert, sendPotholeUpdate } = require('../services/alertService');

// POST /api/reports/citizen
exports.submitCitizenReport = async (req, res) => {
  try {
    const { location, severity, description, photoUrl } = req.body;
    const [lng, lat] = location.coordinates;

    // Check for nearby pothole
    const matched = await findNearbyPothole(lat, lng, 30);

    const report = new CitizenReport({
      location,
      severity,
      description,
      photoUrl,
      matchedPothole: matched ? matched._id : null,
    });
    await report.save();

    if (matched) {
      // Increment citizenReports count
      const updated = await Pothole.findByIdAndUpdate(
        matched._id,
        {
          $inc: { citizenReports: 1 },
          $set: {
            source: 'both',
            severity: severity, // possibly upgrade severity
            updatedAt: new Date(),
          },
        },
        { new: true }
      );
      sendPotholeUpdate(updated);
      sendAlert('citizen', `Citizen report matched pothole ${updated._id}`, { potholeId: updated._id });
      return res.status(201).json({ message: 'Report matched existing pothole', pothole: updated });
    }

    // No match – create new pothole from citizen report
    const newPothole = new Pothole({
      location,
      severity,
      source: 'citizen',
      citizenReports: 1,
      status: 'detected',
      sensorScore: 20, // lower confidence
    });
    await newPothole.save();
    sendPotholeUpdate(newPothole);
    sendAlert('citizen', `New pothole reported by citizen`, { potholeId: newPothole._id });
    res.status(201).json({ message: 'New pothole created from citizen report', pothole: newPothole });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/reports/citizen – list all citizen reports
exports.getCitizenReports = async (req, res) => {
  try {
    const reports = await CitizenReport.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
