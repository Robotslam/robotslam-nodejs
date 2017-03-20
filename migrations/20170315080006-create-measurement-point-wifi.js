'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('measurement_point_wifi', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      measurement_point_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'measurement_point',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },
      bssid: {
        type: Sequelize.STRING
      },
      ssid: {
        type: Sequelize.STRING
      },
      rssi: {
        type: Sequelize.INTEGER
      },
      age: {
        type: Sequelize.INTEGER
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('measurement_point_wifi');
  }
};
