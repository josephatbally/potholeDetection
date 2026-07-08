const express = require('express');
const router = express.Router();
const { ingestSensorData, getSensors } = require('../controllers/sensorController');

router.post('/data', ingestSensorData);
router.get('/', getSensors);

module.exports = router;
