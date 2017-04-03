const express = require('express');
const ros = require('../modules/ros');
const models = require('../models');

const router = express.Router();

router.param('building', function (req, res, next, id) {
  models.building
    .findById(id)
    .then((building) => {
      if (building === null) {
        next(new Error('404'));
      }
      req.building = building;
      next();
    })
    .catch((err) => {
      next(new Error('Failed to load building'));
    });
});

router.get('/', async function (req, res) {
  //noinspection JSUnresolvedVariable,JSUnresolvedFunction
  const buildings = await models.building.findAll({
    order: [['id', 'asc']],
  });

  res.render('buildings/index', {
    title: 'Buildings',
    buildings: buildings.map((m) => m.get()),
  });
});

router.post('/', async function (req, res) {
  const building = await models.building.create({
    name: req.body.name,
    cps_id: req.body.cps_id
  });

  res.redirect(`/buildings/${building.id}`);
});

router.get('/:id', async function (req, res) {
  const building = await models.building.find({
    where: {
      id: req.params.id
    },
    include: [models.map],
    order: [[models.map, 'id', 'desc']]
  });

  res.render('buildings/view', {
    title: building.name,
    building: building.get(),
    active: ros.active
  });
});

router.post('/:building', async function (req, res) {
  req.building.update(req.body);
  res.redirect(`/buildings/${req.building.id}`);
});

router.post('/:building/explore', async function (req, res) {
  if (ros.active) {
    throw new Error('404');
  }

  const map = await req.building.createMap({
    name: req.body.name,
    floor: req.body.floor
  });
  ros.explore(map);

  res.redirect(`/buildings/${req.building.id}`);
});

router.get('/:building/explore', async function (req, res) {
  if (ros.active) {
    ros.stop();
  }

  res.redirect(`/buildings/${req.building.id}`);
});

module.exports = router;
