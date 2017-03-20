const express = require('express');
const router = express.Router();
const models = require('../models');

router.get('/', async function (req, res) {
  //noinspection JSUnresolvedVariable,JSUnresolvedFunction
  const measurements = await models.measurement.findAll();

  res.render('measurements/index', {
    title: 'Measurements',
    measurements: measurements,
  });
});

module.exports = router;
