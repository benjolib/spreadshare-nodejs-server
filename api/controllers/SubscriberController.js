'use strict'

const Controller = require('trails/controller')
const _ = require('lodash')
/**
 * @module SubscriberController
 * @description subscriber.
 */
module.exports = class SubscriberController extends Controller {

    /**
     * list Subscriber
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    async list(req, res) {

        let body = req.body
        let {SubscriberService} = this.app.services

        try {
            let subscribers = await SubscriberService.find(body)
            return res.json({flag: true, data: subscribers, message: 'subscribers list', code: 200})
        }
        catch (e) {
            console.log(e)
            return res.json({flag: false, data: e, message: e.message, code: 500});

        }
    }

    async subscribe(req, res) {

        let body = req.body
        let user = req.user
        let {SubscriberService} = this.app.services
        if (!body || !body.tableId || !body.status) {
            return res.json({flag: false, data: {}, message: 'Missing parameter', code: 400});
        }
        let model = {
            tableId: body.tableId,
            status: body.status,
            type: body.type,
            userId: user.id
        }
        try {
            let tags = await SubscriberService.subscribe(model)
            return res.json({flag: true, data: tags, message: 'Success', code: 200});
        }
        catch (e) {
            return res.json({flag: false, data: e, message: e.message, code: 500});
        }
    }

    async unsubscribe(req, res) {

        let params = req.params
        let id = params.id;
        let {SubscriberService} = this.app.services

        try {
            let tag = await SubscriberService.destroy(id)
            return res.json({flag: true, data: tag, message: 'delete tag successfully', code: 200});
        }
        catch (e) {
            return res.json({flag: false, data: e, message: e.message, code: 500});
        }
    }
}

