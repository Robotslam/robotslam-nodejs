const express = require('express');
const router = express.Router();
const ros = require('../modules/ros');

/* GET home page. */
router.get('/start', function(req, res, next) {
  ros.start();
  res.redirect('/');
});

router.get('/stop', function(req, res, next) {
  ros.stop();
  res.redirect('/');
});

module.exports = router;
