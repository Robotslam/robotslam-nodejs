'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface
      .addColumn('map', 'name', {
        type: Sequelize.STRING,
      }).then(() => {
        return queryInterface.addColumn('map', 'ref_topleft', {
          type: Sequelize.GEOMETRY('point'),
        });
      }).then(() => {
        return queryInterface.addColumn('map', 'ref_topright', {
          type: Sequelize.GEOMETRY('point'),
        });
      }).then(() => {
        return queryInterface.addColumn('map', 'ref_bottomleft', {
          type: Sequelize.GEOMETRY('point'),
        });
      });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface
      .removeColumn('map', 'name')
      .then(() => {
        return queryInterface.removeColumn('map', 'ref_topleft')
      }).then(() => {
        return queryInterface.removeColumn('map', 'ref_topright')
      }).then(() => {
        return queryInterface.removeColumn('map', 'ref_bottomleft')
      });
  }
};
