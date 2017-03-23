'use strict';
module.exports = function(sequelize, DataTypes) {
  const measurement = sequelize.define('measurement', {
  }, {
    tableName: 'measurement',
    underscored: true,
    underscoredAll: true,
    classMethods: {
      associate: function(models) {
        measurement.belongsTo(models.map);
        measurement.hasMany(models.measurementPoint);
      }
    }
  });
  return measurement;
};
