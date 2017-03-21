'use strict';
module.exports = function(sequelize, DataTypes) {
  const Map = sequelize.define('map', {
    resolution: DataTypes.FLOAT,
    width: DataTypes.INTEGER,
    height: DataTypes.INTEGER,
    origin_x: DataTypes.FLOAT,
    origin_y: DataTypes.FLOAT,
    origin_yaw: DataTypes.FLOAT
  }, {
    tableName: 'map',
    underscored: true,
    underscoredAll: true,
    classMethods: {
      associate: function(models) {
        Map.belongsTo(models.building);
      }
    }
  });
  return Map;
};
