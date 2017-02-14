const fs = require('fs');
const csv = require('fast-csv');

class CsvWriter {

  constructor() {
    this.started = false;
  }

  /**
   * Start the file writing
   */
  start(filename) {
    if (this.started) {
      throw 'Cannot open new stream when one already exists';
    }

    this.started = true;

    this.csvStream = csv.createWriteStream();
    this.fsWriteStream = fs.createWriteStream(filename + '.csv');
    this.csvStream.pipe(this.fsWriteStream);
  }

  writeLines(data) {

    if (!this.started) {
      throw 'No open stream';
    }

    if (data == null) {
      return;
    }

    console.dir(data);

    data.forEach((line) => {
      this.csvStream.write(line);
    });

  }

  /**
   * Close the open streams.
   */
  stop() {
    this.started = false;

    this.csvStream.end();
    this.fsWriteStream.destroy();
  }

}

module.exports = CsvWriter;
