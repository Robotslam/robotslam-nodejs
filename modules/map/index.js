const fs = require('fs');
const roslib = require('roslib');
const Jimp = require('jimp');
const models = require('../../models');

class MapListener {
  constructor(ros) {
    this._ros = ros;

    this.topic = new roslib.Topic({
      ros: this._ros,
      name: '/map',
      messageType: 'nav_msgs/OccupancyGrid',
    });
  }

  save() {
    console.log('Waiting for map data');
    this.topic.subscribe((msg) => {
      console.log('Got map data, saving...');
      // Since we only want to store the map once, quit listening after
      this.topic.unsubscribe();

      saveNewMap(msg);
    });
  }
}

async function saveNewMap(msg) {
  const map = await models.map.create({
    resolution: msg.info.resolution,
    width: msg.info.width,
    height: msg.info.height,
    origin_x: msg.info.origin.position.x,
    origin_y: msg.info.origin.position.y,
    origin_yaw: 0, // Harcoded value, we assume that yaw is always 0
  });

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

  image.write(`data/maps/${map.id}.png`);
}

module.exports = MapListener;
