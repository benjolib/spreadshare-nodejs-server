"use strict";

const Model = require("trails/model");

/**
 * @module Tags
 * @description tags
 */
module.exports = class Tags extends Model {
  static config(app, Sequelize) {
    return {
      options: {
        classMethods: {
          associate: models => {
            models.Tags.belongsTo(models.User, {
              targetKey: "id",
              foreignKey: "userId",
              onDelete: "NO ACTION"
            });
          }
        }
      }
    };
  }

  static schema(app, Sequelize) {
    let { INTEGER, DATE, literal, STRING, TEXT, BOOLEAN } = Sequelize;

    return {
      userId: { type: INTEGER, allowNull: false },
      title: { type: STRING, allowNull: false },
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
