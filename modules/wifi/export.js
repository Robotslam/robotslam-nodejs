/**
 * Accepts the WiFi scan message, and formats it into correct csv format
 *
 * @param msg
 */
function exportCsv(msg) {

  const out = [];

  // Iterate over each measurement time
  msg.forEach((m) => {

    // Ensure we actually have some data to export
    if (m.measurements.length <= 0) {
      return null;
    }

    const timestamp = stampToTimestamp(m.stamp);

    const measurements = m.measurements.map(formatMeasurement(timestamp));
    //console.log(measurements);

    out.push(formatHeader(timestamp, m));
    out.push(['AV', '1.0', 1]);
    out.push([]);
    out.push(...measurements);
    out.push([]);
    out.push(['-- New Line --']);
  });

  return out;
}

function formatMeasurement(timestamp, val) {
  return (val) => {
    const age = timestamp - stampToTimestamp(val.stamp);
    return [
      'W',       // WiFi / BT?
      val.bssid, // BSSID
      val.ssid,  // SSID
      val.rssi,  // RSSID
      '',        // Capabilities (Encryption Type?)
      '',        // Frequency
      age,       // Age
      '',        // Venue Name    (Only available on passpoint network)
      ''         // Operator Name (Only available on passpoint network)
    ];
  }
}

function formatHeader(timestamp, msg) {
  return [
    1,              // Valid?
    msg.position.x, // Latitude
    msg.position.y, // Longitude
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
    timestamp, // Last scantime
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

/**
 * Converts the ROS time attribute to milliseconds timestamp.
 *
 * @param {object} stamp
 * @returns {number}
 */
function stampToTimestamp(stamp) {
  return stamp.secs * 1000 + Math.round(stamp.nsecs / 1000000);
}

module.exports = exportCsv;
