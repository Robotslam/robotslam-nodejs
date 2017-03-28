const express = require('express');
const ros = require('../modules/ros');
const models = require('../models');

const router = express.Router();

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

router.get('/create', function (req, res) {
  res.render('buildings/create', {
    title: 'Buildings'
  });
});

router.post('/', async function (req, res) {
  const building = await models.building.create({
    name: req.body.name
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

router.get('/:id/explore', async function (req, res) {
  const building = await models.building.findById(req.params.id);
  if (building === null) {
    res.status(404).render('404');
  }

  if (ros.active) {
    ros.stop();
  } else {
    const map = await building.createMap({});
    ros.explore(map);
  }

  res.redirect(`/buildings/${building.id}`);
});

module.exports = router;
