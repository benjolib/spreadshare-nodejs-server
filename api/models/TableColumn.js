"use strict";

const Model = require("trails/model");

/**
 * @module TableColumn
 * @description table column
 */
module.exports = class TableColumn extends Model {
  static config(app, Sequelize) {
    return {
      options: {
        classMethods: {
          associate: models => {
            models.TableColumn.belongsTo(models.User, {
              targetKey: "id",
              foreignKey: "userId",
              onDelete: "NO ACTION",
              onUpdate: "NO ACTION"
            });
            models.TableColumn.belongsTo(models.Table, {
              targetKey: "id",
              foreignKey: "tableId",
              onDelete: "CASCADE",
              onUpdate: "NO ACTION"
            });
          }
        }
      }
    };
  }

  static schema(app, Sequelize) {
    let { INTEGER, DATE, literal, STRING, FLOAT } = Sequelize;

    return {
      tableId: { type: INTEGER, allowNull: false },
      userId: { type: INTEGER, allowNull: false },
      title: { type: STRING, allowNull: false },
      position: { type: INTEGER(11) },
      width: { type: FLOAT },
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
