'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('measurement', 'map_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'measurement'
      },
      onUpdate: 'cascade',
      onDelete: 'cascade'
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('measurement', 'map_id');
  }
};
