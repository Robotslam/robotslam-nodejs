const crypto = require('crypto');
const config = require('config');
const csv_string = require('./csv_string');

const KEY = config.get('export.key');
const SALT = config.get('export.salt');

/**
 * Accepts the WiFi scan message, and formats it into correct csv format
 */
function exportCsvString(points, transformer) {
  return buildCsv(points, transformer).then(() => {
    //return csv_string(out);
    return JSON.stringify(out, null, 4);
  });
}

function exportCsvArray(points, transformer) {

}

function buildCsv(points, transformer) {
  const out = [];

  let p = Promise.resolve();
  let i = 1;
  // Iterate over each measurement time
  points.forEach((point) => {
    // Ensure we actually have some data to export
    if (point.measurementPointWifis.length <= 0) {
      console.error(`Warning: Position #${i} does not contain any scans.`);
      //return;
    }

    p = p.then(() => {
      let outLocal = [];
      const formattedMsg = formatPoint(point, transformer);
      return hash(formattedMsg, i++).then((h) => {
        outLocal.push(...formattedMsg);
        outLocal.push(h);
        //outLocal.push(['-- New Line --']);
      });
    });
  });

  return p;
}

function hash(msg, i) {
  return csv_string(msg)
    .then((data) => {
      const hmac = crypto.createHmac('sha256', KEY);
      const o = hmac.update(`robotslamimei;${i};${data};${SALT}`).digest('hex');

      return ['H', i, o];
    });
}

function formatPoint(point, transformer) {
  const measurements = point.measurementPointWifis.map(formatMeasurement);

  const out = [];

  out.push(formatHeader(point, transformer));
  out.push(['AV', '1.0', 1]);
  out.push([]);
  out.push(...measurements);
  out.push([]);

  return out;
}

function formatMeasurement(val) {
  return [
    'W',       // WiFi / BT?
    val.bssid, // BSSID
    val.ssid,  // SSID
    val.rssi,  // RSSID
    '',        // Capabilities (Encryption Type?)
    '',        // Frequency
    val.age,       // Age
    '',        // Venue Name    (Only available on passpoint network)
    ''         // Operator Name (Only available on passpoint network)
  ];
}

function formatHeader(point, transformer) {
  const position = transformer.transformPoint(point.x, point.y);
  return [
    1,              // Valid?
    position.x, // Latitude
    position.y, // Longitude
    0.1,            // Accuracy
    0,              // Altitude
    0,              // Speed
    0,              // Bearing
    0,              // Age of location
    '',
    '',
    'f',
    'f',
    0,
    point.time.getTime(), // Last scantime
    'robotslamimei', // Unique identifier for device
    'RobotSlam', // Application name
    '',
    '',
    0,  // WiFi getLocation?
    0,  // noLearning?
    '',
    0,  // refPoints
    '',
    '',
    '', // Room
    '', // Accuracy?
    '',
    '',
  ];
}

module.exports = exportCsv;
