const roslib = require('roslib');

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
    this.topic.subscribe(function (msg) {
      console.log(msg);
    });
  }

  stop() {
    this.topic.unsubscribe();
  }


}

module.exports = WiFiScanner;
//const wifiScanner = new WiFiScanner();
//export default WiFiScanner;
