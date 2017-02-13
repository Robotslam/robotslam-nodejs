const URL = require('url-parse');
const roslib = require('roslib');
const WiFiScanner = require('./wifi');

//const wifi_scanner = new WiFiScanner(ros);

class RosManager {

  constructor() {
    const ros_uri = new URL(process.env['ROS_MASTER_URI']);
    this.ros = new roslib.Ros({
      url: 'ws://' + ros_uri.hostname + ':9090'
    });

    this.ros.on('connection', () => {
      console.log('Connected to websocket server.');
      this.connected = true;
    });

    this.ros.on('error', function (error) {
      console.log('Error connecting to websocket server: ', error);
    });

    this.ros.on('close', function () {
      console.log('Connection to websocket server closed.');
    });
  }

  start() {
    if (!this.connected) {
      throw 'Not connected to server';
    }


  }

  stop() {
    // TODO: Implement
  }

}

module.exports = new RosManager();
