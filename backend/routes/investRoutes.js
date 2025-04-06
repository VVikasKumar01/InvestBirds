
const express = require('express');
const router = express.Router();
const { buildPortfolio } = require('../controllers/investController');

router.post('/build', buildPortfolio);

module.exports = router;
