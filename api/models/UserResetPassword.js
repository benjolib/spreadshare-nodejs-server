"use strict";

const Model = require("trails/model");

/**
 * @module UserResetPassword
 * @description userresetpassword
 */
module.exports = class UserResetPassword extends Model {
  static config(app, Sequelize) {
    return {
      options: {
        classMethods: {
          associate: models => {
            models.UserResetPassword.belongsTo(models.User, {
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
    let { INTEGER, STRING, DATE, literal } = Sequelize;

    return {
      userId: { type: INTEGER, allowNull: false },
      code: { type: STRING(48), allowNull: false },
      status: { type: STRING(1), defaultValue: "P" },
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
