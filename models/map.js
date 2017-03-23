'use strict';
module.exports = function(sequelize, DataTypes) {
  const Map = sequelize.define('map', {
    name: DataTypes.STRING,
    resolution: DataTypes.FLOAT,
    width: DataTypes.INTEGER,
    height: DataTypes.INTEGER,
    origin_x: DataTypes.FLOAT,
    origin_y: DataTypes.FLOAT,
    origin_yaw: DataTypes.FLOAT,
    ref_topleft: DataTypes.GEOMETRY('point'),
    ref_topright: DataTypes.GEOMETRY('point'),
    ref_bottomleft: DataTypes.GEOMETRY('point')
  }, {
    tableName: 'map',
    underscored: true,
    underscoredAll: true,
    classMethods: {
      associate: function(models) {
        Map.belongsTo(models.building);
        Map.hasMany(models.measurement)
      }
    }
  });
  return Map;
};
