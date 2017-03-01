const express = require('express');
const router = express.Router();
const ros = require('../modules/ros');

router.get('/start', function (req, res) {
  try {
    ros.start();
  } catch (err) {
    throw new Error('No connection to ROS');
  }

  res.redirect('/');
});

router.get('/stop', function (req, res) {
  try {
    ros.stop();
  } catch (err) {
    throw new Error('No connection to ROS');
  }

  res.redirect('/');
});

module.exports = router;
