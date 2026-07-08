const express = require('express');
const router = express.Router();
const { getCrews, createCrew, updateCrew } = require('../controllers/crewController');

router.get('/', getCrews);
router.post('/', createCrew);
router.put('/:id', updateCrew);

module.exports = router;
