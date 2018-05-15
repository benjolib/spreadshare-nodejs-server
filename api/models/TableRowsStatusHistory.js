"use strict";

const Model = require("trails/model");

/**
 * @module TableRowsStatusHistory
 * @description TableRowsStatusHistory
 */
module.exports = class TableRowsStatusHistory extends Model {
  static config(app, Sequelize) {
    return {
      options: {
        classMethods: {
          associate: models => {
            models.TableRowsStatusHistory.belongsTo(models.TableRow, {
              targetKey: "id",
              foreignKey: "tableRowId",
              onDelete: "CASCADE"
            });
          }
        }
      }
    };
  }

  static schema(app, Sequelize) {
    let { INTEGER, DATE, literal, STRING } = Sequelize;

    return {
      tableRowId: { type: INTEGER, allowNull: false },
      status: { type: STRING, allowNull: false, defaultValue: "P" },
      description: { type: STRING },
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
