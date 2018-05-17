"use strict";

const Service = require("trails/service");
const _ = require("lodash");
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
    let { Table } = this.app.orm;

    return Table.create(fields).then(data => {
      if (_.isEmpty(data)) throw new Error(`Table not Created!.`);
      return data.toJSON();
    });
  }

  /**
   * add column
   * @param fields
   * @returns {*|PromiseLike<T>|Promise<T>}
   */
  addColumn(fields) {
    let { TableColumn } = this.app.orm;

    return TableColumn.create(fields).then(data => {
      if (_.isEmpty(data)) throw new Error(`Table Column not Created!.`);
      return data.toJSON();
    });
  }

  /**
   * update column
   * @param fields
   * @param id
   * @returns {*|PromiseLike<T>|Promise<T>}
   */
  updateColumn(fields, id) {
    let { TableColumn } = this.app.orm;

    return TableColumn.update(fields, { where: { id } }).then(data => {
      return data;
    });
  }

  /**
   * delete column
   * @param id
   * @returns {*|PromiseLike<T>|Promise<T>}
   */
  removeColumn(id) {
    let { TableColumn } = this.app.orm;

    return TableColumn.destroy({ where: { id } }).then(data => {
      return data;
    });
  }

  /**
   * update table
   * @param fields
   * @param id
   * @returns {*|PromiseLike<T>|Promise<T>}
   */
  update(fields, id) {
    let { Table } = this.app.orm;

    return Table.update(fields, { where: { id } }).then(data => {
      return data;
    });
  }

  /**
   * get table details
   * @param id
   * @returns {*|PromiseLike<T>|Promise<T>}
   */
  find(id) {
    let { Table } = this.app.orm;
    return Table.find({ where: id }).then(data => {
      if (_.isEmpty(data)) throw new Error(`Table not found!.`);
      return data.toJSON();
    });
  }

  /**
   * remove table
   * @param id
   * @returns {*|PromiseLike<T>|Promise<T>}
   */
  remove(id) {
    let { Table } = this.app.orm;

    return Table.destroy({ where: { id } }).then(data => {
      return data;
    });
  }

  /**
   * find popular list of table
   * @param fields
   * @returns {Promise<T>}
   */
  find(fields) {
    let { sequelize } = this.app.orm.User;
    let { TABLE, TABLE_INFO } = this.app.config.constants.tables;
    let { schema } = sequelize.options;

    let condSql = "",
      order;

    if (fields.hasOwnProperty("sort")) {
      order = fields.order === "asc" ? "ASC" : "DESC";
      condSql = `${condSql} ORDER BY "${fields.sort}" ${order}`;
    }
    if (parseInt(fields.start)) condSql += " OFFSET " + fields.start;
    if (parseInt(fields.limit)) condSql += " LIMIT " + fields.limit;
    let sql = `select t.*                
           from ${schema}.${TABLE} t 
           left join ${schema}.${TABLE_INFO} ti on ti."tableId"= t.id 
          ${condSql}`;

    return sequelize
      .query(sql, {
        bind: [],
        type: sequelize.QueryTypes.SELECT
      })
      .then(result => {
        return _.map(result, data => {
          return data;
        });
      })
      .catch(err => {
        throw err;
      });
  }
};
