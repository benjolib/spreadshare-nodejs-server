"use strict";

const Model = require("trails/model");

/**
 * @module User
 * @description user model
 */
module.exports = class User extends Model {
  static config(app, Sequelize) {
    return {
      options: {
        underscored: true,
        classMethods: {
          associate: models => {
            models.User.hasMany(models.Passport, {
              foreignKey: "user_id",
              onDelete: "CASCADE"
            });
            models.User.hasMany(models.Token, {
              foreignKey: "user_id",
              onDelete: "CASCADE"
            });

            models.User.hasMany(models.UserFollower, {
              foreignKey: "userId",
              onDelete: "CASCADE"
            });

            models.User.hasMany(models.UserFollower, {
              foreignKey: "followedBy",
              onDelete: "CASCADE"
            });

            models.User.hasMany(models.Table, {
              foreignKey: "owner",
              onDelete: "NO ACTION"
            });

            models.User.hasOne(models.UserConnection, {
              foreignKey: "userId",
              onDelete: "CASCADE"
            });

            models.User.hasOne(models.UserLocation, {
              foreignKey: "userId",
              onDelete: "CASCADE"
            });
          }
        }
      }
    };
  }

  static schema(app, Sequelize) {
    let { BOOLEAN, literal, STRING, DATE, JSONB } = Sequelize;

    return {
      name: {
        type: STRING,
        allowNull: false
      },
      email: {
        type: STRING,
        allowNull: false,
        unique: true
      },
      mobile: {
        type: STRING
      },
      handle: {
        type: STRING
      },
      emailSettings: {
        type: JSONB
      },
      username: {
        type: STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: STRING,
        allowNull: false
      },
      description: {
        type: STRING
      },
      location: {
        type: STRING
      },
      tagline: {
        type: STRING
      },
      website: {
        type: STRING
      },
      image: {
        type: STRING
      },
      emailConfirmationToken: {
        type: STRING(100)
      },
      passwordResetToken: {
        type: STRING
      },
      passwordResetSentAt: {
        type: DATE,
        field: "updatedAt",
        defaultValue: literal("NOW()")
      },
      lastSessionId: {
        type: STRING(100)
      },
      lastLogin: {
        type: DATE,
        field: "updatedAt",
        defaultValue: literal("NOW()")
      },
      confirmed: {
        type: BOOLEAN,
        defaultValue: false
      },
      status: {
        type: STRING,
        defaultValue: "D"
      },
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
