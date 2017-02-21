const fs = require('fs-promise');
const express = require('express');
const exportCsv = require('../modules/wifi/export');
const csv_string = require('../modules/wifi/csv_string');
const yaml = require('js-yaml');
const Transformer = require('../modules/transformer');
const router = express.Router();

router.get('/', function (req, res, next) {
  fs.readdir('data/raw')
    .then((files) => {
      const filteredFiles = files.filter((item) => {
        return item.split('.').pop() == 'json';
      });

      res.render('export', {
        title: 'Export',
        files: filteredFiles
      });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.post('/', function (req, res, next) {

  const filename = req.body.file;
  const fileWithoutExt = filename.split('.')[0];
  const newFilename = fileWithoutExt + '.csv';

  fs.readFile('data/raw/' + fileWithoutExt + '.json', 'utf-8')
    .then((raw_json) => {
      const description = yaml.load(req.files.map_description.data);
      const data = JSON.parse(raw_json);
      const transformer = new Transformer(description);

      data.forEach((value) => {
        const transformedPoint = transformer.transformPoint(value.position.x, value.position.y);
        value.position.x = transformedPoint.x;
        value.position.y = transformedPoint.y;
      });

      return exportCsv(data);
    })
    .then((d) => {
      return csv_string(d);
    })
    .then((output) => {
      //res.setHeader('content-disposition', 'attachment; filename=' + newFilename);
      res.setHeader('content-type', 'text/plain');
      res.send(output);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(err);
    });
});

router.post('/visualize', function (req, res, next) {

  const filename = req.body.file;
  const fileWithoutExt = filename.split('.')[0];
  const newFilename = fileWithoutExt + '.csv';


  fs.readFile('data/raw/' + fileWithoutExt + '.json', 'utf-8')
    .then((raw_json) => {

      const description = yaml.load(req.files.map_description.data);
      const data = JSON.parse(raw_json);
      const transformer = new Transformer(description);
      const coords = [];

      data.forEach((value) => {
        transformedPoint = transformer.transformPoint(value.position.x, value.position.y);
        coords.push([transformedPoint.x, transformedPoint.y]);
      });

      res.render('export_visualize', {
        title: 'Export',
        coords: JSON.stringify(coords)
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(err);
    });
});

module.exports = router;
