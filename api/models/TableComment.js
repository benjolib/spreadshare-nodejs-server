"use strict";

const Model = require("trails/model");

/**
 * @module TableComment
 * @description TableComment
 */
module.exports = class TableComment extends Model {
  static config(app, Sequelize) {
    return {
      options: {
        classMethods: {
          associate: models => {
            models.TableComment.belongsTo(models.Table, {
              targetKey: "id",
              foreignKey: "tableId",
              onDelete: "CASCADE"
            });
            models.TableComment.belongsTo(models.User, {
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
    let { INTEGER, DATE, literal, TEXT } = Sequelize;

    return {
      parentId: { type: INTEGER, allowNull: false },
      tableId: { type: INTEGER, allowNull: false },
      userId: { type: INTEGER, allowNull: false },
      comment: { type: TEXT },
      votesCount: { type: INTEGER(11) },
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
