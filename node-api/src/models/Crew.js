const mongoose = require('mongoose');

const crewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: {
    type: String,
    enum: ['available', 'on_route', 'on_site'],
    default: 'available',
  },
  assignedPothole: { type: mongoose.Schema.Types.ObjectId, ref: 'Pothole', default: null },
  members: [{ type: String }], // crew member names
  contact: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Crew', crewSchema);
