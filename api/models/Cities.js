"use strict";

const Model = require("trails/model");

/**
 * @module Cities
 * @description cities
 */
module.exports = class Cities extends Model {
  static config(app, Sequelize) {
    return {
      options: {
        classMethods: {
          //If you need associations, put them here
          associate: models => {
            models.Cities.hasMany(models.Location, {
              foreignKey: "cityId",
              onDelete: "NO ACTION",
              onUpdate: "NO ACTION"
            });
          }
        }
      }
    };
  }

  static schema(app, Sequelize) {
    let { STRING, FLOAT, DATE, literal } = Sequelize;

    return {
      city: { type: STRING, allowNull: false },
      region: { type: STRING },
      country: { type: STRING, allowNull: false },
      continent: { type: STRING },
      lat: { type: FLOAT },
      lng: { type: FLOAT },
      createdAt: {
        type: DATE,
        field: "createdAt",
        defaultValue: literal("NOW()")
      },
      updatedAt: {
        type: DATE,
        field: "updatedAt",
        defaultValue: literal("NOW()")
      }
    };
  }
};
