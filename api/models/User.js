'use strict'

const Model = require('trails/model')

/**
 * @module User
 * @description user model
 */
module.exports = class User extends Model {

  static config (app, Sequelize) {

    return {
      options: {
        underscored: true,
        classMethods: {
          associate: (models) => {
            models.User.hasMany(models.Passport, {
              foreignKey: 'user_id',
              onDelete: 'CASCADE'
            })
            models.User.hasMany(models.Token, {
              foreignKey: 'user_id',
              onDelete: 'CASCADE'
            })
          }
        }
      }
    }
  }

  static schema (app, Sequelize) {

    let { BOOLEAN, INTEGER, STRING, TEXT } = Sequelize;

    return {

      name: {
        type: STRING,
      },
      email: {
        type: STRING,
        allowNull: false
      },
      mobile: {
        type: STRING,
      },
    }
  }
}
