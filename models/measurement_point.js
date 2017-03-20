'use strict';
module.exports = function(sequelize, DataTypes) {
  const measurementPoint = sequelize.define('measurementPoint', {
    x: {
      type: DataTypes.FLOAT
    },
    y: {
      type: DataTypes.FLOAT
    },
    z: {
      type: DataTypes.FLOAT
    },
    time: {
      type: DataTypes.DATE
    }
  }, {
    tableName: 'measurement_point',
    underscored: true,
    underscoredAll: true,
    classMethods: {
      associate: function(models) {
        measurementPoint.belongsTo(models.measurement);
        measurementPoint.hasMany(models.measurementPointWifi);
      }
    }
  });
  return measurementPoint;
};
