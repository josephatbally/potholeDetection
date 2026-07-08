const Pothole = require('../models/Pothole');
const { sendPotholeUpdate } = require('../services/alertService');

// GET /api/potholes – with filters
exports.getPotholes = async (req, res) => {
  try {
    const { status, severity, limit = 100, skip = 0 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (severity) filter.severity = severity;

    const potholes = await Pothole.find(filter)
      .sort({ detectedAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));
    const total = await Pothole.countDocuments(filter);
    res.json({ potholes, total });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/potholes/:id
exports.getPotholeById = async (req, res) => {
  try {
    const pothole = await Pothole.findById(req.params.id);
    if (!pothole) return res.status(404).json({ error: 'Not found' });
    res.json(pothole);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// PUT /api/potholes/:id – update status or assignment
exports.updatePothole = async (req, res) => {
  try {
    const { status, assignedCrew, repairedAt } = req.body;
    const pothole = await Pothole.findById(req.params.id);
    if (!pothole) return res.status(404).json({ error: 'Not found' });

    if (status) pothole.status = status;
    if (assignedCrew) pothole.assignedCrew = assignedCrew;
    if (status === 'repaired') pothole.repairedAt = new Date();
    pothole.updatedAt = new Date();
    await pothole.save();

    sendPotholeUpdate(pothole);
    res.json(pothole);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/potholes/stats – aggregate statistics
exports.getStats = async (req, res) => {
  try {
    const total = await Pothole.countDocuments();
    const detected = await Pothole.countDocuments({ status: 'detected' });
    const inProgress = await Pothole.countDocuments({ status: 'in_progress' });
    const repaired = await Pothole.countDocuments({ status: 'repaired' });
    const today = new Date();
    today.setHours(0,0,0,0);
    const newToday = await Pothole.countDocuments({ detectedAt: { $gte: today } });
    const avgRepairTime = await Pothole.aggregate([
      { $match: { status: 'repaired', repairedAt: { $exists: true } } },
      { $project: { diff: { $subtract: ['$repairedAt', '$detectedAt'] } } },
      { $group: { _id: null, avg: { $avg: '$diff' } } }
    ]);
    const avgDays = avgRepairTime.length ? (avgRepairTime[0].avg / (1000*60*60*24)).toFixed(1) : 0;
    res.json({
      total,
      detected,
      inProgress,
      repaired,
      newToday,
      avgRepairTime: avgDays,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
