const fs = require('fs');
const express = require('express');
const exportCsv = require('../modules/wifi/export');
const csv_string = require('../modules/wifi/csv_string');
const yaml = require('js-yaml');
const Transformer = require('../modules/transformer');
const router = express.Router();

router.get('/', function (req, res, next) {

  fs.readdir('data/raw', (err, files) => {
    if (err) {
      return res.status(500).send(err);
    }

    const filteredFiles = files.filter((item) => {
      return item.split('.').pop() == 'json';
    });

    res.render('export', {
      title: 'Export',
      files: filteredFiles
    });

  });
});

router.post('/', function (req, res, next) {

  const filename = req.body.file;
  const fileWithoutExt = filename.split('.')[0];
  const newFilename = fileWithoutExt + '.csv';


  fs.readFile('data/raw/' + fileWithoutExt + '.json', 'utf-8', (err, raw_json) => {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      // req.files.map_description.mv('/tmp/map_description.yaml', function(err) {
      //   if (err) {
      //     res.status(500).send(err); // .....
      //   } else {
      //res.setHeader('content-disposition', 'attachment; filename=' + newFilename);
      res.setHeader('content-type', 'text/plain');

      const description = yaml.load(req.files.map_description.data);
      const data = JSON.parse(raw_json);
      //res.send(data);
      const transformer = new Transformer(description);
      // console.log(description.gps_references);
      let strToSend = '';
      for (var i = 0; i < data.length; i++) {
        // strToSend += data[i].position.x + ',' + data[i].position.y + '\n';
        transformedPoint = transformer.transformPoint(data[i].position.x, data[i].position.y);
        data[i].position.x = transformedPoint.x;
        data[i].position.y = transformedPoint.y;
        //strToSend += transformedPoint.x + ',' + transformedPoint.y + '\n';
      }
      //res.send(strToSend);
      exportCsv(data)
        .then((d) => {
          return csv_string(d);
        })
        .then((output) => {
          res.send(output);
        });
      //   };
      // });
    }
  });
});

router.post('/visualize', function (req, res, next) {

  const filename = req.body.file;
  const fileWithoutExt = filename.split('.')[0];
  const newFilename = fileWithoutExt + '.csv';


  fs.readFile('data/raw/' + fileWithoutExt + '.json', 'utf-8', (err, raw_json) => {
    if (err) {
      console.error(err);
      res.status(500).send(err);
    } else {
      // req.files.map_description.mv('/tmp/map_description.yaml', function(err) {
      //   if (err) {
      //     res.status(500).send(err); // .....
      //   } else {
      //res.setHeader('content-disposition', 'attachment; filename=' + newFilename);
      //res.setHeader('content-type', 'text/plain');

      const description = yaml.load(req.files.map_description.data);
      const data = JSON.parse(raw_json);
      //res.send(data);
      const transformer = new Transformer(description);
      // console.log(description.gps_references);
      const coords = [];
      for (var i = 0; i < data.length; i++) {
        // strToSend += data[i].position.x + ',' + data[i].position.y + '\n';
        transformedPoint = transformer.transformPoint(data[i].position.x, data[i].position.y);
        coords.push([transformedPoint.x, transformedPoint.y]);
        //strToSend += transformedPoint.x + ',' + transformedPoint.y + '\n';
      }
      //res.send(strToSend);
      /*csv_string(exportCsv(parsedJson)).then((output) => {
       res.send(output);
       });*/
      //   };
      // });

      res.render('export_visualize', {
        title: 'Export',
        coords: JSON.stringify(coords)
      });
    }
  });
});

module.exports = router;
