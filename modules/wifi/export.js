/**
 * Accepts the WiFi scan message, and formats it into correct csv format
 *
 * @param msg
 */
function exportCsv(msg) {

  // Ensure we actually have some data to export
  if (msg.measurements.length <= 0) {
    return null;
  }

  // Add a timestamp field, which is in milliseconds.
  const measurements = msg.measurements.map(function(val) {
    val.timestamp = val.stamp.secs * 1000 + Math.round(val.stamp.nsecs / 1000000);

    return val;
  });

  const sortedMeasurements = measurements.sort(function(a, b) {
    return a.timestamp - b.timestamp;
  });

  const ref = sortedMeasurements[0];
  const tmp = sortedMeasurements.map(function(val) {
    val.age = ref.timestamp - val.timestamp;
  });

  console.log(tmp);




  console.log(msg.measurements);
}

module.exports = exportCsv;
