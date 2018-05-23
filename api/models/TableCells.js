"use strict";

const Model = require("trails/model");

/**
 * @module TableCells
 * @description TableCells
 */
module.exports = class TableCells extends Model {
  static config(app, Sequelize) {
    return {
      options: {
        classMethods: {
          associate: models => {
            models.TableCells.belongsTo(models.TableRow, {
              targetKey: "id",
              foreignKey: "rowId",
              onDelete: "CASCADE",
              onUpdate: "NO ACTION"
            });
            models.TableCells.belongsTo(models.TableColumn, {
              targetKey: "id",
              foreignKey: "columnId",
              onDelete: "CASCADE",
              onUpdate: "NO ACTION"
            });
            models.TableCells.belongsTo(models.User, {
              targetKey: "id",
              foreignKey: "userId",
              onDelete: "NO ACTION",
              onUpdate: "NO ACTION"
            });
            models.TableCells.belongsTo(models.User, {
              targetKey: "id",
              foreignKey: "lastEditedBy",
              onDelete: "NO ACTION",
              onUpdate: "NO ACTION"
            });

            models.TableCells.hasMany(models.ChangeRequest, {
              foreignKey: "cellId",
              onDelete: "CASCADE",
              onUpdate: "NO ACTION"
            });
          }
        }
      }
    };
  }

  static schema(app, Sequelize) {
    let { INTEGER, DATE, literal, STRING, TEXT } = Sequelize;

    return {
      rowId: { type: INTEGER, allowNull: false },
      columnId: { type: INTEGER, allowNull: false },
      userId: { type: INTEGER, allowNull: false },
      content: { type: TEXT },
      link: { type: STRING },
      lastEditedBy: { type: INTEGER },
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
