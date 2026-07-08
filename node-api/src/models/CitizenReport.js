const mongoose = require('mongoose');

const citizenReportSchema = new mongoose.Schema({
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }, // [lng, lat]
  },
  photoUrl: { type: String }, // URL or base64
  severity: {
    type: String,
    enum: ['minor', 'moderate', 'severe'],
    required: true,
  },
  description: { type: String },
  matchedPothole: { type: mongoose.Schema.Types.ObjectId, ref: 'Pothole', default: null },
  status: {
    type: String,
    enum: ['pending', 'verified', 'duplicate'],
    default: 'pending',
  },
  createdAt: { type: Date, default: Date.now },
});

citizenReportSchema.index({ location: '2dsphere' });
citizenReportSchema.index({ createdAt: -1 });

module.exports = mongoose.model('CitizenReport', citizenReportSchema);
