const roslib = require('roslib');
const exportCsv = require('./export');

class WiFiScanner {
  constructor(ros) {
    this._ros = ros;

    this.topic = new roslib.Topic({
      ros: this._ros,
      name: '/wifi_scanner/data_filtered_array',
      messageType: 'wifi_scanner/WifiMeasurementArray'
    });
  }

  start() {
    console.log("hi");
    this.topic.subscribe(function (msg) {
      exportCsv(msg);
    });
  }

  stop() {
    this.topic.unsubscribe();
  }

}

module.exports = WiFiScanner;
