const express = require('express');
const router = express.Router();
const ros = require('../modules/ros');

router.get('/start', function (req, res, next) {
  try {
    ros.start();
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }

  res.redirect('/');
});

router.get('/stop', function (req, res, next) {
  try {
    ros.stop();
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }

  res.redirect('/');
});

module.exports = router;
