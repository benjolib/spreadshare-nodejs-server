"use strict";

const Model = require("trails/model");

/**
 * @module UserNotification
 * @description UserNotifications
 */
module.exports = class UserNotification extends Model {
  static config(app, Sequelize) {
    return {
      options: {
        classMethods: {
          associate: models => {
            models.UserNotification.belongsTo(models.User, {
              targetKey: "id",
              foreignKey: "createdBy",
              onDelete: "NO ACTION"
            });
            models.UserNotification.belongsTo(models.User, {
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
    let { INTEGER, DATE, literal, STRING, TEXT, BOOLEAN, ENUM } = Sequelize;

    return {
      createdBy: { type: INTEGER, allowNull: false },
      userId: { type: INTEGER },
      type: {
        type: ENUM,
        values: ["F", "S", "NL", "C", "CUS", "COM"]
      },
      text: { type: TEXT },
      itemId: { type: INTEGER },
      itemType: { type: STRING },
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
