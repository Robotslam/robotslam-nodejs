var express = require('express');
var router = express.Router();
const ros = require('../modules/ros');


/* GET home page. */
router.get('/', function (req, res, next) {
  console.log(ros.active);
  res.render('index', {
    title: 'Express',
    active: ros.active
  });
});

module.exports = router;
