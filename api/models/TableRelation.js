"use strict";

const Model = require("trails/model");

/**
 * @module TableRelation
 * @description tablerelation
 */
module.exports = class TableRelation extends Model {
  static config(app, Sequelize) {
    return {
      options: {
        classMethods: {
          associate: models => {
            models.TableRelation.belongsTo(models.Table, {
              targetKey: "id",
              foreignKey: "tableId",
              onDelete: "CASCADE",
              onUpdate: "NO ACTION"
            });
            models.TableRelation.belongsTo(models.Table, {
              targetKey: "id",
              foreignKey: "relatedTableId",
              onDelete: "NO ACTION",
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
      relatedTableId: { type: INTEGER, allowNull: false },
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
