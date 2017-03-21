const express = require('express');
const ros = require('../modules/ros');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Robotslam',
    active: ros.active
  });
});

module.exports = router;
