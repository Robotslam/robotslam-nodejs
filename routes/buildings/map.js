const express = require('express');
const models = require('../../models');

const router = express.Router();

router.get('/:map', async function (req, res) {
  //noinspection JSUnresolvedVariable,JSUnresolvedFunction
  const map = await models.map.find({
    where: {
      id: req.params.map
    },
    include: [models.measurement]
  });

  console.log(map);

  res.render('maps/view', {
    title: 'Map',
    map: map,
  });
});

module.exports = router;
