'use strict';
module.exports = function(sequelize, DataTypes) {
  const Building = sequelize.define('building', {
    name: DataTypes.STRING
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
