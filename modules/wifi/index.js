const fs = require('fs');
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

    this.messages = [];

    this.topic.subscribe((msg) => {
      this.messages.push(msg);
    });
  }

  stop() {
    this.topic.unsubscribe();

    const currentDate = new Date();
    const filename = currentDate.getTime();

    fs.writeFile('data/raw/' + filename + '.json', JSON.stringify(this.messages), (err) => {
      if (err) throw err;
    });
  }

}

module.exports = WiFiScanner;
