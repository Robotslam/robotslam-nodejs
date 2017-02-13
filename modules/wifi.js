class WiFiScanner {
  constructor(ros) {
    this._ros = ros;

    this.topic = new roslib.Topic({
      ros: this.ros,
      name: '/wifi_scanner/data_filtered',
      messageType: 'wifi_scanner/WifiMeasurement'
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
