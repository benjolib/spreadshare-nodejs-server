"use strict";

const Model = require("trails/model");

/**
 * @module Topic
 * @description topics
 */
module.exports = class Topic extends Model {
  static config(app, Sequelize) {}

  static schema(app, Sequelize) {
    let { STRING, DATE, literal } = Sequelize;

    return {
      title: { type: STRING, allowNull: false },
      image: { type: STRING(100) },
      color: { type: STRING(6) },
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
