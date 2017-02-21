const fs = require('fs');
const roslib = require('roslib');
const Jimp = require('jimp');

class MapListener {
  constructor(ros) {
    this._ros = ros;

    this.topic = new roslib.Topic({
      ros: this._ros,
      name: '/map',
      messageType: 'nav_msgs/OccupancyGrid',
    });
  }

  start() {

    this.messages = [];

    this.topic.subscribe((msg) => {
      this.messages.push(msg);
      console.log(msg);

      saveImage(msg);
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

function saveImage(msg) {

  const image = new Jimp(msg.info.width, msg.info.height);

  const width = msg.info.width;
  const height = msg.info.height;

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {

      const index = col + ((height - row - 1) * width);
      const data = msg.data[index];

      let a = 255;
      let val = 0;
      if (data === 100) {
        val = 0;
      } else if (data === 0) {
        val = 255;
      } else {
        a = 0;
        val = 127;
      }

      image.setPixelColour(Jimp.rgbaToInt(val, val, val, a), col, row);
    }
  }

  image.write('test.png');
  console.log('Wrote image to disk');
}

module.exports = MapListener;
