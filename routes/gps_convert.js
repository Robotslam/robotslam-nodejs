const bluebird = require('bluebird');
const fs = require('fs-promise');
const express = require('express');
const router = express.Router();
const ros = require('../modules/ros');
const gm = require('gm').subClass({imageMagick: true});
const yaml = require('js-yaml');

router.get('/', function (req, res, next) {
  res.render('gps_convert/index', {
    title: 'GPS Convert Upload'
  });
});

router.post('/fit_on_map', function (req, res, next) {
  if (!req.files) {
    res.status(400).send('No files were uploaded.');
    return;
  }

  return Promise
    .all([
      fs.writeFile('/tmp/map_description.yaml', req.files.map_description.data),
      storeImage(req.files.map_image.data)
    ])
    .then((data) => {
      const image = data[1];
      const description = yaml.safeLoad(req.files.map_description.data);

      res.render('gps_convert/fit_on_map', {
        title: 'Fit on map',
        map_image_data: 'data:image/x-portable-graymap;base64,' + image,
        gps_references: description.gps_references,
        origin: description.origin,
        resolution: description.resolution
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(err);
    });
});

function storeImage(data) {
  return Promise.resolve()
    .then(() => {
      return fs.writeFile('/tmp/map_image.pgm', data);
    })
    .then(() => {
      return new Promise((fulfill, reject) => {
        gm('/tmp/map_image.pgm')
          .transparent('#CDCDCD')
          .write('/tmp/map_image.png', function (err) {
            if (err) {
              return reject(err);
            }
            return fulfill(err);
          });
      });
    })
    .then(() => {
      return fs.readFile('/tmp/map_image.png');
    })
    .then((image) => {
      return new Buffer(image).toString('base64');
    });
}

module.exports = router;
