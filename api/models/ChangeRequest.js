'use strict'

const Model = require('trails/model')

/**
 * @module ChangeRequest
 * @description ChangeRequest
 */
module.exports = class ChangeRequest extends Model {

  static config (app, Sequelize) {

      return {
          options: {

              classMethods: {
                  associate: (models) => {
                      models.ChangeRequest.belongsTo(models.TableCells, {
                          targetKey: 'id',
                          foreignKey: 'cellId',
                          onDelete: 'CASCADE'
                      })
                      models.ChangeRequest.belongsTo(models.User, {
                          targetKey: 'id',
                          foreignKey: 'userId',
                          onDelete: 'NO ACTION'
                      })
                      models.ChangeRequest.belongsTo(models.TableRow, {
                          targetKey: 'id',
                          foreignKey: 'tableRowId',
                          onDelete: 'NO ACTION'
                      })
                  }
              }
          }
      }
  }

  static schema (app, Sequelize) {

      let {INTEGER, DATE, literal, STRING, TEXT} = Sequelize;

      return {
          cellId: {type: INTEGER, allowNull:false},
          userId: {type: INTEGER, allowNull:false},
          tableRowId: {type: INTEGER, allowNull:false},
          from: {type: TEXT, allowNull:false},
          to: {type: TEXT, allowNull:false},
          comment: {type: TEXT, allowNull:false},
          status: {type: STRING(1), allowNull:false, defaultValue:'P'},
          createdAt: {
              type: DATE,
              field: 'createdAt',
              defaultValue: literal('NOW()'),
          },
          updatedAt: {
              type: DATE,
              field: 'updatedAt',
              defaultValue: literal('NOW()'),
          },
      }
  }
}
