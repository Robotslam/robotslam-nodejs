'use strict';
module.exports = function(sequelize, DataTypes) {
  const Building = sequelize.define('building', {
    name: DataTypes.STRING,
    cps_id: DataTypes.INTEGER,
  }, {
    tableName: 'building',
    underscored: true,
    underscoredAll: true,
    classMethods: {
      associate: function(models) {
        Building.hasMany(models.map);
      }
    }
  });
  return Building;
};
