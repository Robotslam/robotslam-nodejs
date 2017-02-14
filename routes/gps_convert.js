var express = require('express');
var router = express.Router();
const ros = require('../modules/ros');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('gps_convert/index', {
    title: 'GPS Convert Upload'
  });
});

module.exports = router;
