const express = require('express');
const router = express.Router();
const { getPotholes, getPotholeById, updatePothole, getStats } = require('../controllers/potholeController');

router.get('/', getPotholes);
router.get('/stats', getStats);
router.get('/:id', getPotholeById);
router.put('/:id', updatePothole);

module.exports = router;
