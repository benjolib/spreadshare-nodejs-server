"use strict";

const Model = require("trails/model");

/**
 * @module FeedAction
 * @description feed action model added
 */
module.exports = class FeedAction extends Model {
  static config(app, Sequelize) {
    return {
      options: {
        //underscored: true,
        classMethods: {
          //If you need associations, put them here
          associate: models => {
            //More information about associations here : http://docs.sequelizejs.com/en/latest/docs/associations/
            models.FeedAction.belongsTo(models.User, {
              targetKey: "id",
              onDelete: "NO ACTION",
              onUpdate: "NO ACTION",
              foreignKey: "userId"
            });
          }
        }
      }
    };
  }

  static schema(app, Sequelize) {
    let { STRING, INTEGER, DATE, literal, JSONB } = Sequelize;

    return {
      userId: {
        type: INTEGER,
        allowNull: false
      },
      itemId: {
        type: STRING,
        allowNull: false
      },
      itemType: {
        type: STRING,
        allowNull: false,
        defaultValue: "stream"
      },
      tableId: {
        type: INTEGER
      },
      feedType: {
        type: STRING,
        allowNull: false,
        defaultValue: "created" //collaborated
      },
      status: {
        type: STRING,
        allowNull: false,
        defaultValue: "P" //pending,approved,deleted
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
