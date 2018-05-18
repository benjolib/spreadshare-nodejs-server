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
  findPopular(fields) {
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

  /**
   * addRow in table
   * @param fields
   * @returns {Promise|*|PromiseLike<T>|Promise<T>}
   */
  addrow(fields) {
    let { TableRow } = this.app.orm;

    return TableRow.create(fields).then(data => {
      if (_.isEmpty(data)) throw new Error(`Table row not Created!.`);
      return data.toJSON();
    });
  }

  /**
   * add cell
   * @param fields
   * @returns {Promise|*|PromiseLike<T>|Promise<T>}
   */
  addTableCellInBulks(fields) {
    let { TableCells } = this.app.orm;

    return TableCells.bulkCreate(fields, { returning: true }).then(data => {
      data = _.map(data, kw => {
        return kw.toJSON();
      });
      return data;
    });
  }

  /**
   * particular Table Row delete
   * @param id
   * @returns {Promise|*|PromiseLike<T>|Promise<T>}
   */
  removeTableRow(id) {
    let { TableRow } = this.app.orm;

    return TableRow.destroy({ where: { id } }).then(data => {
      return data;
    });
  }

  /**
   * Update row multiple cells in bulk
   * @param fields
   * @returns {Promise<T>}
   */
  updateRowCell(fields) {
    let { sequelize } = this.app.orm.User;
    let { TABLE_CELL } = this.app.config.constants.tables;
    let { schema } = sequelize.options;

    let values = `VALUES `;

    _.map(fields.rowColumns, (data, index) => {
      if (index > 0) values = `${values},`;
      values = `${values} (${data.id},'${data.content}','${data.link}')`;
    });

    let sql = `UPDATE ${schema}.${TABLE_CELL} as t set
                 content = c.content,
                 link = c.link 
              FROM (
                 ${values}
              ) AS c(id, content, link)
              WHERE
                 c.id  = t.id 
              RETURNING t.*;`;

    return sequelize
      .query(sql, {
        bind: [],
        type: sequelize.QueryTypes.UPDATE
      })
      .then(rows => {
        return rows;
      })
      .catch(err => {
        throw err;
      });
  }

  /**
   * Update table row
   * @param fields
   * @param id
   * @returns {Promise|*|PromiseLike<T>|Promise<T>}
   */
  updateTableRow(fields, id) {
    let { TableRow } = this.app.orm;

    return TableRow.update(fields, { where: { id } }).then(rows => {
      return rows;
    });
  }

  /**
   * Add change request for cell
   * @param fields
   * @returns {Promise|*|PromiseLike<T>|Promise<T>}
   */
  addChangeRequest(fields) {
    let { ChangeRequest } = this.app.orm;
    let data = [];

    //Todo change from content

    _.map(fields, f => {
      data.push({
        cellId: f.id,
        userId: f.userId,
        tableRowId: f.tableRowId,
        to: f.content || f.link,
        from: f.content || f.link,
        comment: f.comment
      });
    });

    return ChangeRequest.bulkCreate(data, { returning: true }).then(data => {
      data = _.map(data, kw => {
        return kw.toJSON();
      });
      return data;
    });
  }
};
