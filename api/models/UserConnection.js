"use strict";

const Model = require("trails/model");

/**
 * @module UserConnection
 * @description usserconnections
 */
module.exports = class UserConnection extends Model {
  static config(app, Sequelize) {
    return {
      options: {
        classMethods: {
          associate: models => {
            models.UserConnection.belongsTo(models.User, {
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
    let { INTEGER, STRING, DATE, literal } = Sequelize;

    return {
      userId: { type: INTEGER, allowNull: false },
      twitter: { type: STRING },
      facebook: { type: STRING },
      dribbble: { type: STRING },
      medium: { type: STRING },
      producthunt: { type: STRING },
      behance: { type: STRING },
      github: { type: STRING },
      gitlab: { type: STRING },
      bitbucket: { type: STRING },
      slack: { type: STRING },
      angellist: { type: STRING },
      googleplus: { type: STRING },
      stackoverlflow: { type: STRING },
      linkedin: { type: STRING },
      quora: { type: STRING },
      reddit: { type: STRING },
      ycombinator: { type: STRING },
      instagram: { type: STRING },
      visco: { type: STRING },
      soundcloud: { type: STRING },
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
