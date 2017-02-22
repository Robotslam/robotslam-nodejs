const fs = require('fs-promise');
const express = require('express');
const exportCsv = require('../modules/wifi/export');
const csv_string = require('../modules/wifi/csv_string');
const yaml = require('js-yaml');
const Transformer = require('../modules/transformer');
const router = express.Router();

router.get('/', async (req, res, next) => {
  const files = await fs.readdir('data/raw');
  const filteredFiles = files.filter((item) => {
    return item.split('.').pop() == 'json';
  });

  res.render('export', {
    title: 'Export',
    files: filteredFiles
  });
});

router.post('/', async (req, res, next) => {
  const filename = req.body.file;
  const fileWithoutExt = filename.split('.')[0];
  const newFilename = fileWithoutExt + '.csv';

  const raw_json = await fs.readFile('data/raw/' + fileWithoutExt + '.json', 'utf-8');
  const description = yaml.load(req.files.map_description.data);
  const data = JSON.parse(raw_json);
  const transformer = new Transformer(description);

  data.forEach((value) => {
    const transformedPoint = transformer.transformPoint(value.position.x, value.position.y);
    value.position.x = transformedPoint.x;
    value.position.y = transformedPoint.y;
  });

  const d = await exportCsv(data);
  const output = await csv_string(d);
  //res.setHeader('content-disposition', 'attachment; filename=' + newFilename);
  res.setHeader('content-type', 'text/plain');
  res.send(output);
});

router.post('/visualize', async (req, res, next) => {
  const filename = req.body.file;
  const fileWithoutExt = filename.split('.')[0];
  const newFilename = fileWithoutExt + '.csv';

  const raw_json = await fs.readFile('data/raw/' + fileWithoutExt + '.json', 'utf-8');
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
});

module.exports = router;
