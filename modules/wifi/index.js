const fs = require('fs');
const roslib = require('roslib');
// const exportCsv = require('./export');
// const CsvWriter = require('./csv_writer');

class WiFiScanner {
  constructor(ros) {
    this._ros = ros;

    this.topic = new roslib.Topic({
      ros: this._ros,
      name: '/wifi_scanner/data_filtered_array',
      messageType: 'wifi_scan' +
      'ner/WifiMeasurementArray'
    });
  }

  start() {

    this.messages = [];
    /*
    const currentDate = new Date();
    const filename = currentDate.getTime();

    this.writer = new CsvWriter();
    this.writer.start(filename);
*/

    this.topic.subscribe((msg) => {
      this.messages.push(msg);
      //this.writer.writeLines(exportCsv(msg));
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
