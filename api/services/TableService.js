'use strict'

const Service = require('trails/service')
const _ = require('lodash')
/**
 * @module TableService
 * @description table
 */
module.exports = class TableService extends Service {

    /**
     * create table
     * @param fields
     * @returns {*|PromiseLike<T>|Promise<T>}
     */
    create(fields) {

        let {Table} = this.app.orm

        return Table
            .create(fields)
            .then(data => {
                console.log(data)
                return data.toJSON()
            })
    }

    /**
     * add column
     * @param fields
     * @returns {*|PromiseLike<T>|Promise<T>}
     */
    addColumn(fields) {

        let {TableColumn} = this.app.orm

        return TableColumn
            .create(fields)
            .then(data => {
                console.log(data)
                return data.toJSON()
            })
    }

    /**
     * update column
     * @param fields
     * @param id
     * @returns {*|PromiseLike<T>|Promise<T>}
     */
    updateColumn(fields, id) {

        let {TableColumn} = this.app.orm

        return TableColumn
            .update(fields, {where: {id}})
            .then(data => {
                return data
            })
    }

    /**
     * delete column
     * @param id
     * @returns {*|PromiseLike<T>|Promise<T>}
     */
    removeColumn(id) {

        let {TableColumn} = this.app.orm

        return TableColumn
            .destroy({where: {id}})
            .then(data => {
                return data
            })
    }

    /**
     * update table
     * @param fields
     * @param id
     * @returns {*|PromiseLike<T>|Promise<T>}
     */
    update(fields, id) {

        let {Table} = this.app.orm

        return Table
            .update(fields, {where: {id}})
            .then(data => {
                return data
            })
    }

    /**
     * get table details
     * @param id
     * @returns {*|PromiseLike<T>|Promise<T>}
     */
    find(id) {

        let {Table} = this.app.orm
        return Table
            .find({where: id})
            .then(data => {
                return data.toJSON()
            })
    }

    /**
     * remove table
     * @param id
     * @returns {*|PromiseLike<T>|Promise<T>}
     */
    remove(id) {

        let {Table} = this.app.orm

        return Table
            .destroy({where: {id}})
            .then(data => {
                return data
            })
    }

}

