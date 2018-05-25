"use strict";

const Model = require("trails/model");

/**
 * @module TableInfo
 * @description table info
 */
module.exports = class TableInfo extends Model {
  static config(app, Sequelize) {
    return {
      options: {
        classMethods: {
          associate: models => {
            models.TableInfo.belongsTo(models.Table, {
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
    let { INTEGER, DATE, literal } = Sequelize;

    return {
      tableId: { type: INTEGER, allowNull: false },
      totalSpreads: { type: INTEGER, allowNull: false, defaultValue: "0" },
      totalSubscribers: { type: INTEGER, allowNull: false, defaultValue: "0" },
      totalCollaborations: {
        type: INTEGER,
        allowNull: false,
        defaultValue: "0"
      },
      totalView: { type: INTEGER, allowNull: false, defaultValue: "0" },
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
