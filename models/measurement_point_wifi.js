'use strict';
module.exports = function(sequelize, DataTypes) {
  const measurementPointWifi = sequelize.define('measurementPointWifi', {
    bssid: DataTypes.STRING,
    ssid: DataTypes.STRING,
    rssi: DataTypes.INTEGER,
    age: DataTypes.INTEGER,
  }, {
    tableName: 'measurement_point_wifi',
    underscored: true,
    underscoredAll: true,
    classMethods: {
      associate: function(models) {
        measurementPointWifi.belongsTo(models.measurementPoint);
      }
    }
  });
  return measurementPointWifi;
};
