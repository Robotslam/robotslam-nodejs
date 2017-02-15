const csv = require('fast-csv');

/**
 * Returns a Promise containing the csv string.
 *
 * @param data
 * @returns {Promise}
 */
function csv_string(data) {

  return new Promise((fullfill, reject) => {
    csv.writeToString(
      data,
      {},
      (err, data) => {
        if (err) {
          return reject(err);
        }

        console.log(data);

        return fullfill(data);
      }
    );
  });

}

module.exports = csv_string;
