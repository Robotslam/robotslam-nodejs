const express = require('express');
const yaml = require('js-yaml');
const models = require('../models');
const Transformer = require('../modules/transformer');
const exportCsv = require('../modules/wifi/export2');
const ros = require('../modules/ros');

const router = express.Router();

router.get('/', async function (req, res) {
  //noinspection JSUnresolvedVariable,JSUnresolvedFunction
  const measurements = await models.measurement.findAll({
    attributes: ['id', 'created_at', [models.sequelize.fn('COUNT', 'measurementPoints.id'), 'items']],
    include: [{
      attributes: [],
      model: models.measurementPoint,
      group: ['measurement_id']
    }],
    order: [['id', 'desc']],
    group: ['measurement.id']
  });

  res.render('measurements/index', {
    title: 'Measurements',
    active: ros.active,
    measurements: measurements.map((m) => m.get()),
  });
});

router.get('/:id/export', async function (req, res) {
  const measurement = await models.measurement.find(res.id);

  res.render('measurements/export', {
    title: 'Measurements',
    measurement: measurement
  });
});

router.post('/:id/export', async(req, res) => {

  const points = await models.measurementPoint.findAll({
    include: [models.measurementPointWifi],
    order: [['id', 'desc']]
  });

  const description = yaml.load(req.files.map_description.data);
  const transformer = new Transformer(description);
  const output = await exportCsv(points, transformer);

  //res.setHeader('content-disposition', 'attachment; filename=' + newFilename);
  res.setHeader('content-type', 'text/plain');
  res.send(output);
});

router.post('/:id/export/visualize', async(req, res) => {

  const points = await models.measurementPoint.findAll({
    include: [models.measurementPointWifi]
  });

  const description = yaml.load(req.files.map_description.data);
  const transformer = new Transformer(description);
  const coords = [];

  points.forEach((point) => {
    transformedPoint = transformer.transformPoint(point.x, point.y);
    coords.push([transformedPoint.x, transformedPoint.y]);
  });

  res.render('export_visualize', {
    title: 'Export',
    coords: JSON.stringify(coords)
  });
});

module.exports = router;
