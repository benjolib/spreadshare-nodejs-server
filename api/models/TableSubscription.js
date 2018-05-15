"use strict";

const Model = require("trails/model");

/**
 * @module TableSubscription
 * @description TableSubscription
 */
module.exports = class TableSubscription extends Model {
  static config(app, Sequelize) {
    return {
      options: {
        classMethods: {
          associate: models => {
            models.TableSubscription.belongsTo(models.Table, {
              targetKey: "id",
              foreignKey: "tableId",
              onDelete: "CASCADE"
            });
            models.TableSubscription.belongsTo(models.User, {
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
    let { INTEGER, DATE, literal, STRING } = Sequelize;

    return {
      type: { type: STRING(1) },
      tableId: { type: INTEGER, allowNull: false },
      userId: { type: INTEGER, allowNull: false },
      status: { type: STRING, defaultValue: "S" },
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
