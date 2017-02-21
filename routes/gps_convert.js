const config = require('config');
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
      const image = data[1].image;
      const description = yaml.safeLoad(req.files.map_description.data);
      description.image_size = data[1].size;

      res.render('gps_convert/fit_on_map', {
        title: 'Fit on map',
        map_image_data: 'data:image/x-portable-graymap;base64,' + image,
        gps_references: description.gps_references,
        origin: description.origin,
        resolution: description.resolution,
        yaml: yaml.safeDump(description)
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(err);
    });
});

router.post('/download', function (req, res, next) {

  // Decode the base64 encoded file and parse it as yaml.
  const description = yaml.safeLoad(req.body.file);

  const c = JSON.parse(req.body.coordinates);

  const coordinates = [
    c.topleft,
    c.topright,
    c.bottomleft
  ];

  // Set the local coordinates
  coordinates[0].x = 0;
  coordinates[0].y = round(description.image_size.height * description.resolution);
  coordinates[1].x = round(description.image_size.width * description.resolution);
  coordinates[1].y = round(description.image_size.height * description.resolution);
  coordinates[2].x = 0;
  coordinates[2].y = 0;

  description.gps_references = coordinates;

  res.setHeader('content-type', 'text/plain');
  res.send(yaml.safeDump(description));
});

function storeImage(data) {
  return Promise.resolve()
    .then(() => {
      const buffer = new Buffer(data);

      return new Promise((resolve, reject) => {
        const img = gm(buffer, 'image.pgm')
          .transparent(config.get('image.transparent'));

        // TODO: Remove?
        img.write('/tmp/map_image.png', (err) => {
          if (err) {
            console.error(err);
          }
        });

        img.toBuffer('PNG', (err, buffer) => {
          if (err) {
            return reject(err);
          }
          return resolve({img, buffer});
        });
      });
    })
    .then((data) => {
      return new Promise((resolve, reject) => {
        data.img.size((err, size) => {
          if (err) {
            console.error(err);
            return reject(err);
          }

          return resolve({size, buffer: data.buffer});
        });
      });
    })
    .then((data) => {
      return {
        size: data.size,
        image: data.buffer.toString('base64')
      };
    });
}

function round(number) {
  return Math.round(number * 1e2) / 1e2;
}

module.exports = router;
