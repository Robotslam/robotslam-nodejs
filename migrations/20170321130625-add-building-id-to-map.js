'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('map', 'building_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'building'
      },
      onUpdate: 'cascade',
      onDelete: 'cascade'
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('map', 'building_id');
  }
};
