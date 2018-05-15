'use strict'

const Service = require('trails/service')
const _ = require('lodash')
/**
 * @module SubscriberService
 * @description subscriber
 */
module.exports = class SubscriberService extends Service {
    /**
     * find list
     * @param fields
     * @returns {*|PromiseLike<T>|Promise<T>}
     */
    find(fields) {

        let {TableSubscription} = this.app.orm
        let criteria = {}

        if (fields.hasOwnProperty('type')) {
            criteria.type = fields.type
        }

        return TableSubscription
            .findAll({where: criteria})
            .then(tags => {
                return _.map(tags, (tag => {
                    return tag.toJSON()
                }))
            })
    }

    subscribe(fields) {

        let {TableSubscription} = this.app.orm

        return TableSubscription
            .create(fields)
            .then(data => {
                return data.toJSON()
            })
    }

    destroy(id) {

        let {TableSubscription} = this.app.orm

        return TableSubscription
            .destroy({where: {id}})
            .then(data => {
                return data
            })
    }
}

