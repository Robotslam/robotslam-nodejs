var URL = require('url-parse');
var roslib = require('roslib');
var WiFiScanner = require('./modules/wifi');

var ros_uri = new URL(process.env['ROS_MASTER_URI']);
var ros = new ROSLIB.Ros({
    url : 'ws://'+ ros_uri.hostname +':9090'
});

var wifi_scanner = WiFiScanner(ros);