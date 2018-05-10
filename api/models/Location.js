'use strict'

const Model = require('trails/model')

/**
 * @module Location
 * @description location
 */
module.exports = class Location extends Model {

  static config (app, Sequelize) {

    return {
          options: {

              classMethods: {
                  associate: (models) => {
                      models.Location.belongsTo(models.Cities, {
                          targetKey: 'id',
                          foreignKey: 'cityId',
                          onDelete: 'CASCADE'
                      })
                  }
              }
          }
      }
  }

  static schema (app, Sequelize) {

      let {INTEGER, STRING, FLOAT, DATE, literal } = Sequelize;

      return {
          cityId: {type: INTEGER},
          lat :{ type:FLOAT },
          lng :{ type:FLOAT },
          name:{ type: STRING, allowNull:false },
          createdAt: {
              type:DATE,
              field: 'createdAt',
              defaultValue: literal('NOW()'),
          },
          updatedAt: {
              type:DATE,
              field: 'updatedAt',
              defaultValue: literal('NOW()'),
          },
      }
  }
}
