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
      const buffer = new Buffer(data);

      return new Promise((fulfill, reject) => {
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
          return fulfill(buffer);
        });
      });
    })
    .then((image) => {
      return image.toString('base64');
    });
}

module.exports = router;
