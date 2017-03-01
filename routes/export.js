const fs = require('fs-promise');
const express = require('express');
const exportCsv = require('../modules/wifi/export');
const csv_string = require('../modules/wifi/csv_string');
const yaml = require('js-yaml');
const Transformer = require('../modules/transformer');
const router = express.Router();

/**
 * Show a form for selecting measurement and uploading map description.
 */
router.get('/', async (req, res) => {
  // Show list of available measurement files
  const files = await fs.readdir('data/raw');
  const filteredFiles = files.filter((item) => {
    return item.split('.').pop() == 'json';
  });

  res.render('export', {
    title: 'Export',
    files: filteredFiles
  });
});

/**
 * Convert the measurement to Combain's CSV format.
 */
router.post('/', async (req, res) => {
  const filename = req.body.file;
  const fileWithoutExt = filename.split('.')[0];

  const rawMeasurements = await fs.readFile('data/raw/' + fileWithoutExt + '.json', 'utf-8');
  const description = yaml.load(req.files.map_description.data);
  const measurements = JSON.parse(rawMeasurements);
  const transformer = new Transformer(description);

  // Conver the measurements to GPS coords.
  measurements.forEach((value) => {
    const transformedPoint = transformer.transformPoint(value.position.x, value.position.y);
    value.position.x = transformedPoint.x;
    value.position.y = transformedPoint.y;
  });

  const d = await exportCsv(measurements);
  const output = await csv_string(d);
  //res.setHeader('content-disposition', 'attachment; filename=' + newFilename);
  res.setHeader('content-type', 'text/plain');
  res.send(output);
});

/**
 * Visualize the coordinates on the map.
 */
router.post('/visualize', async (req, res) => {
  const filename = req.body.file;
  const fileWithoutExt = filename.split('.')[0];

  const rawMeasurements = await fs.readFile('data/raw/' + fileWithoutExt + '.json', 'utf-8');
  const description = yaml.load(req.files.map_description.data);
  const measurements = JSON.parse(rawMeasurements);
  const transformer = new Transformer(description);
  const coords = [];

  measurements.forEach((value) => {
    transformedPoint = transformer.transformPoint(value.position.x, value.position.y);
    coords.push([transformedPoint.x, transformedPoint.y]);
  });

  res.render('export_visualize', {
    title: 'Export',
    coords: JSON.stringify(coords)
  });
});

module.exports = router;
