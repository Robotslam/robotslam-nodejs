const express = require('express');
const router = express.Router();

const home = require('./home');
const users = require('./users');
const measurements = require('./measurements');
const buildings = require('./buildings');
const map = require('./map');

router.use('/', home);
router.use('/users', users);
router.use('/measurements', measurements);
router.use('/buildings', buildings);
router.use('/maps', map);

module.exports = router;
