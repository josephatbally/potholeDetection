const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
  sensorId: { type: String, required: true, unique: true },
  vehicle: { type: String, required: true },
  status: {
    type: String,
    enum: ['online', 'offline', 'maintenance'],
    default: 'online',
  },
  battery: { type: Number, default: 100 },
  lastReading: { type: Date, default: Date.now },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] },
  },
  registeredAt: { type: Date, default: Date.now },
});

sensorSchema.index({ sensorId: 1 }, { unique: true });

module.exports = mongoose.model('Sensor', sensorSchema);
