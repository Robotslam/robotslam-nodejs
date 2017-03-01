const express = require('express');
const router = express.Router();

const home = require('./home');
const users = require('./users');
const toggle = require('./toggle');
const gps_convert = require('./gps_convert');
const exportRoute = require('./export');

router.use('/', home);
router.use('/users', users);
router.use('/toggle', toggle);
router.use('/gps_convert', gps_convert);
router.use('/export', exportRoute);

module.exports = router;
