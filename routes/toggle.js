const express = require('express');
const router = express.Router();
const ros = require('../modules/ros');
const MapSaver = require('../modules/map');

router.get('/start', function (req, res) {
  try {
    ros.start();
  } catch (err) {
    throw new Error('No connection to ROS');
  }

  res.redirect('/measurements');
});

router.get('/stop', function (req, res) {
  try {
    const saver = new MapSaver(ros.ros);
    saver.save();

    ros.stop();
  } catch (err) {
    throw new Error('No connection to ROS');
  }

  res.redirect('/measurements');
});

module.exports = router;
