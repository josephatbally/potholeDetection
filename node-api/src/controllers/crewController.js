const Crew = require('../models/Crew');

// GET /api/crews
exports.getCrews = async (req, res) => {
  try {
    const crews = await Crew.find();
    res.json(crews);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /api/crews
exports.createCrew = async (req, res) => {
  try {
    const crew = new Crew(req.body);
    await crew.save();
    res.status(201).json(crew);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// PUT /api/crews/:id
exports.updateCrew = async (req, res) => {
  try {
    const crew = await Crew.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!crew) return res.status(404).json({ error: 'Not found' });
    res.json(crew);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
