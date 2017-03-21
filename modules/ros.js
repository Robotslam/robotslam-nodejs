const URL = require('url-parse');
const roslib = require('roslib');
const WiFiScanner = require('./wifi');
const MapListener = require('./map');

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

    this.active = false;

    this.wifiScanner = new WiFiScanner(this.ros);
  }

  start() {
    if (!this.connected) {
      throw 'Not connected to server';
    }

    this.active = true;
    this.wifiScanner.start();
    //this.mapListener.start();
  }

  stop() {
    this.active = false;
    this.wifiScanner.stop();
  }

}

module.exports = new RosManager();
