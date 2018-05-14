'use strict'

const Policy = require('trails/policy')
const Joi = require('joi')
const Schemas = require('../schemas')
/**
 * @module JoiPolicy
 * @description joi
 */
module.exports = class JoiPolicy extends Policy {

    /**
     * Common validation policy for all validator
     * @rules 1. Define schema within validator in api/Schema directory
     *                2. provide config.id in routes
     * @param req
     * @param res
     * @param next
     */
    validate(req, res, next) {

        try {

            let routeConfig = req.route.config;
            let [module, schema] = routeConfig.id.split('.')

            let Validator = new Schemas[module];

            if (!Validator || !Validator[schema]) {
                throw new Error("Validator not found for this route, Please check your routeId (id)")
            }

            Joi.validate(req.body, Validator[schema](), (err, value) => {

                if (err) {
                    if (err.details && err.details[0].type == 'object.allowUnknown') {
                        return res.status(400).json({flag: false, message: err.details[0].message, errorcode: 400});
                    }
                    else {
                        return res.status(400).json({flag: false, message: err.message, errorcode: 400})
                    }
                }
                next();
            })
        }
        catch (e) {
            return res.json({flag: false, message: e.message, errorcode: 500})
        }
    }
}



