"use strict";

const Model = require("trails/model");

/**
 * @module ReadNotification
 * @description read notification
 */
module.exports = class ReadNotification extends Model {
  static config(app, Sequelize) {
    return {
      options: {
        classMethods: {
          associate: models => {
            models.ReadNotification.belongsTo(models.UserNotification, {
              targetKey: "id",
              foreignKey: "notificationId",
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

  static schema() {
    let { INTEGER, DATE, literal, BOOLEAN } = Sequelize;

    return {
      notificationId: { type: INTEGER, allowNull: false },
      userId: { type: INTEGER },
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
