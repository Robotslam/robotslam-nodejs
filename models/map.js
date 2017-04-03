'use strict';
module.exports = function (sequelize, DataTypes) {
  const Map = sequelize.define('map', {
    name: DataTypes.STRING,
    floor: DataTypes.INTEGER,
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
    getterMethods: {
      origin: function () {
        return [
          this.origin_x,
          this.origin_y,
          this.origin_yaw
        ];
      },
      references: function () {
        if (this.ref_topleft === null || this.ref_topright === null || this.ref_bottomleft === null) {
          return [];
        }

        return [
          this.ref_topleft.coordinates,
          this.ref_topright.coordinates,
          this.ref_bottomleft.coordinates
        ];
      }
    },
    classMethods: {
      associate: function (models) {
        Map.belongsTo(models.building);
        Map.hasMany(models.measurement)
      }
    }
  });
  return Map;
};
