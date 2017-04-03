const express = require('express');
const yaml = require('js-yaml');
const models = require('../models');
const Transformer = require('../modules/transformer');
const exportCsv = require('../modules/wifi/export2');
const ros = require('../modules/ros');
const CPS = require('../modules/cps');
const config = require('config');

const cps = new CPS(config.get('export.subscriberNumber'), 2139, 1);

const router = express.Router();

router.get('/', async function (req, res) {
  //noinspection JSUnresolvedVariable,JSUnresolvedFunction
  const measurements = await models.measurement.findAll({
    attributes: ['id', 'created_at'],
    include: [{
      model: models.map,
      include: [models.building],
      required: false,
    }],
    order: [['id', 'asc']],
  });

  res.render('measurements/index', {
    title: 'Measurements',
    active: ros.active,
    measurements: measurements.map((m) => m.get()),
  });
});

router.get('/:id', async function (req, res) {
  const measurement = await models.measurement.find({
    where: {
      id: req.params.id,
    },
    include: [
      models.map,
      {
        model: models.measurementPoint,
        include: [{
          model: models.measurementPointWifi
        }]
      }
    ],
    order: [[models.measurementPoint, 'time', 'asc']],
  });

  try {
    const description = formatReferencePoints(measurement.map);
    const transformer = new Transformer(description);
    const coords = [];

    measurement.measurementPoints.forEach((point) => {
      transformedPoint = transformer.transformPoint(point.x, point.y);
      coords.push([transformedPoint.x, transformedPoint.y]);
    });

    res.render('measurements/view', {
      title: 'Measurements',
      measurement: measurement,
      coords: JSON.stringify(coords)
    });
  } catch (error) {
    return res.status(500).send('Unable to transform data');
  }
});

router.get('/:id/export_do', async function (req, res) {
  res.status(200);
  res.set('Content-Type', 'text/event-stream;charset=utf-8');
  res.set('Cache-Control', 'no-cache');
  //res.set('Transfer-Encoding', 'identity');

  const measurement = await models.measurement.find({
    where: {
      id: req.params.id,
    },
    include: [
      models.map,
      {
        model: models.measurementPoint,
        include: [{
          model: models.measurementPointWifi
        }]
      }
    ],
    order: [[models.measurementPoint, 'time', 'asc']],
  });

  try {
    const points = measurement.measurementPoints;
    const description = formatReferencePoints(measurement.map);

    const transformer = new Transformer(description);
    const output = await exportCsv.exportCsvArray(points, transformer);

    // session_starting -> sessions_started -> *progress* -> session_closing -> session_closed
    res.write(`event: session_starting\ndata:\n\n`);
    await cps.startSession();
    let i = 1;
    res.write(`event: session_started\ndata:\n\n`);
    await Promise.all(output.map(async (data) => {
      await cps.sendPoint(data);
      res.write(`event: progress\n`);
      res.write(`data: ${i++}\n\n`);
    }));
    res.write(`event: session_closing\ndata:\n\n`);
    await cps.stopSession();
    res.write(`event: session_closed\ndata:\n\n`);

  } catch (error) {
    res.send('Unable to transform data: ' + error);
  }
});

router.get('/:id/export', async function (req, res) {
  //Consider binding this automatically?
  const measurement = await models.measurement.find({ where: { id: req.params.id } });
  const points = await models.measurementPoint.count({ where: { measurement_id: req.params.id } });
  res.render('measurements/export', {
    title: 'Measurements',
    measurement: measurement,
    points: points
  });
});

router.get('/:id/export_old', async function (req, res) {
  const measurement = await models.measurement.find({
    where: {
      id: req.params.id,
    },
    include: [
      models.map,
      {
        model: models.measurementPoint,
        include: [{
          model: models.measurementPointWifi
        }]
      }
    ],
    order: [[models.measurementPoint, 'time', 'asc']],
  });

  try {
    const points = measurement.measurementPoints;
    const description = formatReferencePoints(measurement.map);

    const transformer = new Transformer(description);
    const output = await exportCsv.exportCsvString(points, transformer);
    //res.setHeader('Content-Disposition', 'attachment; filename=' + newFilename);
    res.setHeader('Content-Disposition', `inline; filename=measurement_${req.params.id}.csv`);
    res.setHeader('Content-Type', 'text/plain');
    res.send(output);
  } catch (error) {
    res.status(500).send('Unable to transform data: ' + error);
  }
});

function formatReferencePoints(map) {
  return {
    origin: [map.origin_x, map.origin_y, map.origin_yaw],
    gps_references: [
      {
        x: 0,
        y: map.height * map.resolution,
        lat: map.ref_topleft.coordinates[0],
        lng: map.ref_topleft.coordinates[1],
      },
      {
        x: map.width * map.resolution,
        y: map.height * map.resolution,
        lat: map.ref_topright.coordinates[0],
        lng: map.ref_topright.coordinates[1],
      },
      {
        x: 0,
        y: 0,
        lat: map.ref_bottomleft.coordinates[0],
        lng: map.ref_bottomleft.coordinates[1],
      }
    ]
  };
}

module.exports = router;
