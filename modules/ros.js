const URL = require('url-parse');
const roslib = require('roslib');
const WiFiScanner = require('./wifi');
const MapSaver = require('./map');

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
    this.mode = 0;
    this.map = null;

    this.wifiScanner = new WiFiScanner(this.ros);
  }

  /*
    Start a new exploration for the building.
  */
  explore(map) {
    if (!this.connected) {
      throw 'Not connected to server';
    }

    if (this.active) {
      throw 'Already active explore';
    }

    this.active = true;
    this.mode = 0;
    this.map = map;
    this.wifiScanner.start(map);
  }

  /*
    Start a new measurement for the map
   */
  measurement(map) {
    if (!this.connected) {
      throw 'Not connected to server';
    }

    if (this.active) {
      throw 'Already active explore';
    }

    this.active = true;
    this.mode = 1;
    this.map = map;
    this.wifiScanner.start(map);
  }

  stop() {
    this.active = false;

    if (this.mode === 0) {
      const mapSaver = new MapSaver(this.ros);
      mapSaver.save(this.map);
    }

    this.wifiScanner.stop();
  }

}

module.exports = new RosManager();
