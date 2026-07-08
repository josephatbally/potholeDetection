const Pothole = require('../models/Pothole');

// Haversine distance in meters
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

async function findNearbyPothole(lat, lng, maxDistance = 20) {
  const potholes = await Pothole.find({
    status: { $ne: 'repaired' }
  }).lean();

  for (const p of potholes) {
    const [plng, plat] = p.location.coordinates;
    const dist = getDistance(lat, lng, plat, plng);
    if (dist <= maxDistance) {
      return p;
    }
  }
  return null;
}

module.exports = { findNearbyPothole };
