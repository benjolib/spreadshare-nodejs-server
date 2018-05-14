'use strict'

const Service = require('trails/service')

/**
 * @module VoteService
 * @description vote service
 */
module.exports = class VoteService extends Service {

  /**
   * Create Vote (Table/TableRow/TableComments)
   * @param fields
   * @returns {*|PromiseLike<T>|Promise<T>}
   */
  create(fields){

    let { Vote }= this.app.orm
    let model = {
      itemId:fields.itemId,
      userId:fields.userId,
      type:fields.type,
    }

    return Vote.create(model)
      .then(data=>{
        return data.toJSON()
      })
  }

  /***
   * Delete vote entry
   * @param fields
   * @returns {Promise<T>}
   */
  remove(fields){
    let { Vote }= this.app.orm
    let condition = {
      itemId:fields.itemId,
      userId:fields.userId,
      type:fields.type,
    }

    return Vote.destroy({where:condition})
      .then(data=>{
        return data
      })
  }
}

