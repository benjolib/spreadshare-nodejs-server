"use strict";

const Model = require("trails/model");

/**
 * @module FeedView
 * @description to manage feed viewers
 */
module.exports = class FeedView extends Model {
  static config(app, Sequelize) {
    return {
      options: {
        //underscored: true,
        timestamps: false,
        classMethods: {
          //If you need associations, put them here
          associate: models => {
            //More information about associations here : http://docs.sequelizejs.com/en/latest/docs/associations/
            models.FeedView.belongsTo(models.User, {
              targetKey: "id",
              onDelete: "CASCADE",
              onUpdate: "NO ACTION",
              foreignKey: "userId"
            });
          }
        }
      }
    };
  }

  static schema(app, Sequelize) {
    let { INTEGER, DATE, literal } = Sequelize;

    return {
      userId: {
        type: INTEGER,
        allowNull: false
      },
      lastView: {
        type: DATE,
        defaultValue: literal("NOW()")
      }
    };
  }
};
