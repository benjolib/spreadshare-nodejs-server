"use strict";

const Model = require("trails/model");

/**
 * @module TableRow
 * @description tablerows
 */
module.exports = class TableRow extends Model {
  static config(app, Sequelize) {
    return {
      options: {
        classMethods: {
          associate: models => {
            models.TableRow.belongsTo(models.User, {
              targetKey: "id",
              foreignKey: "createdBy",
              onDelete: "NO ACTION",
              onUpdate: "NO ACTION"
            });
            models.TableRow.belongsTo(models.User, {
              targetKey: "id",
              foreignKey: "updatedBy",
              onDelete: "NO ACTION",
              onUpdate: "NO ACTION"
            });
            models.TableRow.belongsTo(models.Table, {
              targetKey: "id",
              foreignKey: "tableId",
              onDelete: "CASCADE",
              onUpdate: "NO ACTION"
            });

            models.TableRow.hasMany(models.TableCells, {
              foreignKey: "rowId",
              onDelete: "CASCADE",
              onUpdate: "NO ACTION"
            });

            models.TableRow.hasMany(models.ChangeRequest, {
              foreignKey: "rowId",
              onDelete: "CASCADE",
              onUpdate: "NO ACTION"
            });
          }
        }
      }
    };
  }

  static schema(app, Sequelize) {
    let { INTEGER, DATE, literal, STRING } = Sequelize;

    return {
      tableId: { type: INTEGER, allowNull: false },
      rowId: { type: INTEGER },
      createdBy: { type: INTEGER, allowNull: false },
      updatedBy: { type: INTEGER },
      action: { type: STRING, defaultValue: "S" },
      status: { type: STRING, defaultValue: "P", allowNull: false },
      voteCount: { type: INTEGER, defaultValue: "0" },
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
