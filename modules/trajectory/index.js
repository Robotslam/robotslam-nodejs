const fs = require('fs');
const roslib = require('roslib');
const Jimp = require('jimp');
const models = require('../../models');
const WiFiScanner = require('../wifi');

const imageDir = 'public/data/maps';

class TrajectoryListener {
  constructor(ros, measurement) {
    this._ros = ros;

    this.topic = new roslib.Topic({
      ros: this._ros,
      name: '/trajectory',
      messageType: 'nav_msgs/Path',
    });

    this.callback = (msg) => {
      console.log('Got trajectory data, saving...');

      // Since we only want to store the trajectory once, quit listening after
      this.topic.unsubscribe(this.callback);

      saveNewMap(measurement, msg);
    }
  }

  save() {
    this.topic.subscribe(this.callback);
  }

}

async function saveNewMap(measurement, msg) {
  const points = await measurement.getMeasurementPoints();

  const promises = [];

  points.forEach((point) => {
    const traj = msg.poses.filter((p) => {
      const time = WiFiScanner.stampToTimestamp(p.header.stamp);

      return time < point.time;
    });

    const t = traj[0];

    point.x = t.pose.position.x;
    point.y = t.pose.position.y;
    promises.push(point.save());
  });

  return Promise
    .all(promises)
    .then(() => {
      console.log('Updated points with trajectory');
    });
}

module.exports = TrajectoryListener;
