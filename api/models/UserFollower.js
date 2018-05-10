'use strict'

const Model = require('trails/model')

/**
 * @module UserFollower
 * @description userfollower
 */
module.exports = class UserFollower extends Model {

  static config (app, Sequelize) {
      return {
          options: {

              classMethods: {
                  associate: (models) => {
                      models.UserFollower.belongsTo(models.User, {
                          targetKey: 'id',
                          foreignKey: 'userId',
                          onDelete: 'NO ACTION'
                      })
                      models.UserFollower.belongsTo(models.User, {
                          targetKey: 'id',
                          foreignKey: 'followedBy',
                          onDelete: 'NO ACTION'
                      })
                  }
              }
          }
      }
  }

  static schema (app, Sequelize) {

      let { INTEGER, DATE, literal } = Sequelize;

      return {
          userId: {type: INTEGER, allowNull:false},
          followedBy: {type: INTEGER,  allowNull:false},
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
