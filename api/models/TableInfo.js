"use strict";

const Model = require("trails/model");

/**
 * @module TableInfo
 * @description table info
 */
module.exports = class TableInfo extends Model {
  static config(app, Sequelize) {}

  static schema(app, Sequelize) {
    let { INTEGER, DATE, literal } = Sequelize;

    return {
      tableId: { type: INTEGER, allowNull: false },
      totalSpreads: { type: INTEGER, allowNull: false },
      totalSubscribers: { type: INTEGER, allowNull: false },
      totalCollaborations: { type: INTEGER, allowNull: false },
      totalView: { type: INTEGER, allowNull: false },
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
