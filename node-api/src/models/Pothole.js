const mongoose = require('mongoose');

const potholeSchema = new mongoose.Schema({
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }, // [lng, lat]
  },
  severity: {
    type: String,
    enum: ['minor', 'moderate', 'severe'],
    required: true,
  },
  status: {
    type: String,
    enum: ['detected', 'in_progress', 'repaired'],
    default: 'detected',
  },
  depth: { type: Number, default: 0 }, // in cm
  sensorId: { type: String, default: null },
  citizenReports: { type: Number, default: 0 },
  source: {
    type: String,
    enum: ['sensor', 'citizen', 'both'],
    required: true,
  },
  sensorScore: { type: Number, default: 0 },
  assignedCrew: { type: String, default: null },
  detectedAt: { type: Date, default: Date.now },
  repairedAt: { type: Date },
  updatedAt: { type: Date, default: Date.now },
});

potholeSchema.index({ location: '2dsphere' });
potholeSchema.index({ sensorId: 1 });
potholeSchema.index({ status: 1 });
potholeSchema.index({ detectedAt: -1 });

module.exports = mongoose.model('Pothole', potholeSchema);
