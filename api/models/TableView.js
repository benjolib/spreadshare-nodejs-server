"use strict";

const Model = require("trails/model");

/**
 * @module TableView
 * @description tableview
 */
module.exports = class TableView extends Model {
  static config(app, Sequelize) {
    return {
      options: {
        classMethods: {
          associate: models => {
            models.TableView.belongsTo(models.Table, {
              targetKey: "id",
              foreignKey: "tableId",
              onDelete: "CASCADE",
              onUpdate: "NO ACTION"
            });
            models.TableView.belongsTo(models.User, {
              targetKey: "id",
              foreignKey: "userId",
              onDelete: "CASCADE",
              onUpdate: "NO ACTION"
            });
          }
        }
      }
    };
  }

  static schema(app, Sequelize) {
    let { INTEGER, DATE, literal } = Sequelize;

    return {
      tableId: { type: INTEGER, allowNull: false },
      userId: { type: INTEGER, allowNull: false },
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
