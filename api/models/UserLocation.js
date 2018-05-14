"use strict";

const Model = require("trails/model");

/**
 * @module UserLocation
 * @description UserLocation
 */
module.exports = class UserLocation extends Model {
  static config(app, Sequelize) {
    return {
      options: {
        classMethods: {
          associate: models => {
            models.UserLocation.belongsTo(models.User, {
              targetKey: "id",
              foreignKey: "userId",
              onDelete: "NO ACTION"
            });
            models.UserLocation.belongsTo(models.Location, {
              targetKey: "id",
              foreignKey: "locationId",
              onDelete: "CASCADE"
            });
          }
        }
      }
    };
  }

  static schema(app, Sequelize) {
    let { INTEGER } = Sequelize;

    return {
      userId: { type: INTEGER, allowNull: false },
      locationId: { type: INTEGER, allowNull: false }
    };
  }
};
