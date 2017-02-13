var roslib = require('roslib');
var WiFiScanner = require('./modules/wifi');

var ros_hostname = 
var ros = new ROSLIB.Ros({
    url : 'ws://'+ process.env['ROS_MASTER_URI'] +':9090'
});
var wifi_scanner = WiFiScanner(ros);