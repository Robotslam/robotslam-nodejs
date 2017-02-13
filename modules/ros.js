const URL = require('url-parse');
const roslib = require('roslib');
const WiFiScanner = require('./wifi');

const ros_uri = new URL(process.env['ROS_MASTER_URI']);
const ros = new roslib.Ros({
	url : 'ws://'+ ros_uri.hostname +':9090'
});

ros.on('connection', function() {
	console.log('Connected to websocket server.');

	const cmd_vel = new roslib.Topic({
		ros: ros,
		name: '/wifi_scanner/data_filtered',
		messageType: 'wifi_scanner/WifiMeasurement'
	});

	cmd_vel.subscribe(function (msg) {
		console.log(msg);
	});
});

ros.on('error', function(error) {
	console.log('Error connecting to websocket server: ', error);
});

ros.on('close', function() {
	console.log('Connection to websocket server closed.');
});

const wifi_scanner = new WiFiScanner(ros);