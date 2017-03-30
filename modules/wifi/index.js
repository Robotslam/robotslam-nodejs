const fs = require('fs');
const roslib = require('roslib');

const models = require('../../models');

class WiFiScanner {
  constructor(ros) {
    this._ros = ros;
    this._callback = null;

    this._topic = new roslib.Topic({
      ros: this._ros,
      name: '/wifi_scanner/data_filtered_array',
      messageType: 'wifi_scanner/WifiMeasurementArray'
    });
  }

  async start(map) {
    if (this._callback !== null) {
      throw "WiFiScanner is already started. Please call stop() before attempting to call start().";
    }

    //noinspection JSUnresolvedVariable
    const measurement = await map.createMeasurement({});
    this._callback = (msg) => {
      this
        .storeMessage(measurement, msg)
        .catch((err) => console.error(err));
    };
    this._topic.subscribe(this._callback);

    return measurement;
  }

  stop() {
    this._topic.unsubscribe(this._callback);
    this._callback = null;
  }

  async storeMessage(measurement, msg) {
    const timestamp = WiFiScanner.stampToTimestamp(msg.stamp);
    const wifis = msg.measurements.map(formatMeasurement(timestamp));

    await models.measurementPoint.create({
      measurement_id: measurement.id,
      x: msg.position.x,
      y: msg.position.y,
      z: msg.position.z,
      time: timestamp,
      measurementPointWifis: wifis
    }, {include: [models.measurementPointWifi]});
  }

  static stampToTimestamp(stamp) {
    return stamp.secs * 1000 + Math.round(stamp.nsecs / 1000000);
  }
}

function formatMeasurement(timestamp, val) {
  return (val) => {
    const age = timestamp - WiFiScanner.stampToTimestamp(val.stamp);
    return {
      bssid: val.bssid, // BSSID
      ssid: val.ssid,   // SSID
      rssi: val.rssi,   // RSSID
      age: age
    };
  }
}

module.exports = WiFiScanner;
