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
    let { INTEGER, DATE, literal, STRING, TEXT, BOOLEAN } = Sequelize;

    return {
      createdBy: { type: INTEGER, allowNull: false },
      userId: { type: INTEGER, allowNull: false },
      notificationType: { type: STRING },
      text: { type: TEXT },
      isRead: { type: BOOLEAN, defaultValue: false },
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
