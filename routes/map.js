const express = require('express');
const models = require('../models/index');

const router = express.Router();

router.get('/:map', async function (req, res) {
  //noinspection JSUnresolvedVariable,JSUnresolvedFunction
  const map = await models.map.find({
    where: {
      id: req.params.map
    },
    include: [models.measurement]
  });

  res.render('maps/view', {
    title: 'Map',
    map: map,
  });
});

router.get('/:map/update', async function (req, res) {
  const map = await models.map.find({
    where: {
      id: req.params.map
    }
  });

  res.render('maps/fit_on_map', {
    title: 'Fit on map',
    map: map,
  });
});

router.post('/:map', async function (req, res) {
  const map = await models.map.find({
    where: {
      id: req.params.map
    }
  });

  const coordinates = JSON.parse(req.body.coordinates);

  map.update({
    ref_topleft: {
      type: 'point',
      coordinates: [coordinates.topleft.lat, coordinates.topleft.lng]
    },
    ref_topright: {
      type: 'point',
      coordinates: [coordinates.topright.lat, coordinates.topright.lng]
    },
    ref_bottomleft: {
      type: 'point',
      coordinates: [coordinates.bottomleft.lat, coordinates.bottomleft.lng]
    },
  });

  res.redirect('/maps/' + map.id);
});

module.exports = router;
