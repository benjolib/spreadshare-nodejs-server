"use strict";

const Model = require("trails/model");

/**
 * @module Vote
 * @description Votes
 */
module.exports = class Vote extends Model {
  static config(app, Sequelize) {
    return {
      options: {
        classMethods: {
          associate: models => {
            models.Vote.belongsTo(models.Table, {
              targetKey: "id",
              foreignKey: "itemId",
              onDelete: "CASCADE"
            });
            models.Vote.belongsTo(models.User, {
              targetKey: "id",
              foreignKey: "userId",
              onDelete: "CASCADE"
            });
          }
        }
      }
    };
  }

  static schema(app, Sequelize) {
    let { INTEGER, DATE, literal, STRING } = Sequelize;

    return {
      itemId: { type: INTEGER, allowNull: false },
      userId: { type: INTEGER, allowNull: false },
      type: { type: STRING },
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
