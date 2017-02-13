var URL = require('url-parse');
var roslib = require('roslib');
var WiFiScanner = require('./modules/wifi');

var ros_uri = new URL(process.env['ROS_MASTER_URI']);
var ros = new ROSLIB.Ros({
    url : 'ws://'+ ros_uri.hostname +':9090'
});

ros.on('connection', function() {
	console.log('Connected to websocket server.');
});

ros.on('error', function(error) {
	console.log('Error connecting to websocket server: ', error);
});

ros.on('close', function() {
	console.log('Connection to websocket server closed.');
});

var wifi_scanner = WiFiScanner(ros);