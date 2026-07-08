const express = require('express');
const router = express.Router();
const { submitCitizenReport, getCitizenReports } = require('../controllers/reportController');

router.post('/citizen', submitCitizenReport);
router.get('/citizen', getCitizenReports);

module.exports = router;
