const express = require('express');
const router = express.Router();
const ros = require('../modules/ros');
const base64 = require('node-base64-image');
const gm = require('gm').subClass({imageMagick: true});
const yaml = require('js-yaml');

/* GET home page. */
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

  req.files.map_description.mv('/tmp/map_description.yaml', function(err) {
    if (err) {
      res.status(500).send(err); // .....
    } else {
      description = yaml.load(req.files.map_description.data); // watch out, maybe use safe load?
      req.files.map_image.mv('/tmp/map_image.pgm', function(err) {
        if (err) {
          res.status(500).send(err); // japp
        } else {
          gm('/tmp/map_image.pgm').transparent('#CDCDCD').write('/tmp/map_image.png', function (err) {
            if (err) {
              res.status(500).send(err); // hemskt
            } else {
              base64.encode('/tmp/map_image.png', {string: true, local: true}, function (err, img_res) {
                if (err) {
                  res.status(500).send(err); // absolut horribelt
                } else {
                  res.render('gps_convert/fit_on_map', {
                    title: 'Fit on map',
                    map_image_data: 'data:image/x-portable-graymap;base64,' + img_res,
                    gps_references: description.gps_references,
                    origin: description.origin,
                    resolution: description.resolution
                  });
                }
              });
            }
          });
        }
      });
    }
  });
});

module.exports = router;
