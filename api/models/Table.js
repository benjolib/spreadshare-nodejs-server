"use strict";

const Model = require("trails/model");

/**
 * @module Table
 * @description table
 */
module.exports = class Table extends Model {
  static config(app, Sequelize) {
    return {
      options: {
        classMethods: {
          associate: models => {
            models.Table.belongsTo(models.User, {
              targetKey: "id",
              foreignKey: "owner",
              onDelete: "NO ACTION",
              onUpdate: "NO ACTION"
            });

            models.Table.hasMany(models.TableRow, {
              foreignKey: "tableId",
              onDelete: "CASCADE",
              onUpdate: "NO ACTION"
            });

            models.Table.hasMany(models.TableView, {
              foreignKey: "tableId",
              onDelete: "CASCADE",
              onUpdate: "NO ACTION"
            });

            models.Table.hasMany(models.TableSubscription, {
              foreignKey: "tableId",
              onDelete: "CASCADE",
              onUpdate: "NO ACTION"
            });

            models.Table.hasMany(models.TableRelation, {
              foreignKey: "relatedTableId",
              onDelete: "NO ACTION",
              onUpdate: "NO ACTION"
            });

            models.Table.hasMany(models.TableRelation, {
              foreignKey: "tableId",
              onDelete: "CASCADE",
              onUpdate: "NO ACTION"
            });

            models.Table.hasMany(models.TableComment, {
              foreignKey: "tableId",
              onDelete: "CASCADE",
              onUpdate: "NO ACTION"
            });

            models.Table.hasOne(models.TableInfo, {
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
    let { INTEGER, STRING, DATE, literal, ARRAY, BOOLEAN } = Sequelize;

    return {
      owner: { type: INTEGER, allowNull: false },
      title: { type: STRING(100), allowNull: false },
      tags: { type: ARRAY(INTEGER) },
      tagline: { type: STRING(140) },
      image: { type: STRING },
      description: { type: STRING(140) },
      isThumbnail: { type: BOOLEAN, defaultValue: false },
      curator: { type: ARRAY(INTEGER) },
      relatedList: { type: ARRAY(INTEGER) },
      isPublished: { type: BOOLEAN, defaultValue: false },
      isDraft: { type: BOOLEAN, defaultValue: false },
      publishedAt: {
        type: DATE
      },
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
