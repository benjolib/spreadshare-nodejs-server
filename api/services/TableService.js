"use strict";

const Service = require("trails/service");
const _ = require("lodash");
const moment = require("moment");
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
   * add multiple column
   * @param fields
   * @returns {*|PromiseLike<T>|Promise<T>}
   */
  addMultipleColumns(fields) {
    let { TableColumn } = this.app.orm;

    return TableColumn.bulkCreate(fields.data, { returning: true }).then(
      data => {
        data = _.map(data, kw => {
          return kw.toJSON();
        });
        return data;
      }
    );
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
    let { sequelize } = this.app.orm.Table;
    let { votesType } = this.app.config.constants;
    let {
      TABLE_INFO,
      TABLE,
      TABLE_COLUMN,
      VOTE,
      TAGS,
      USER
    } = this.app.config.constants.tables;
    let { schema } = sequelize.options;
    let sql = ``,
      condSql = ` LIMIT 1`,
      whereCond = ``,
      voteSql = ``,
      tagSql = ``,
      curatorSql = ``;
    voteSql = `(SELECT count(*)::int from ${schema}.${VOTE} where "itemId"=t.id AND "type"='${
      votesType.TABLE
    }') as votes`;
    tagSql = `(select json_agg(json_build_object('id', tg.id, 'title' , tg.title)) 
              from ${schema}.${TAGS} tg where tg.id =ANY(t.tags)) as tags `;
    curatorSql = `(select json_agg(json_build_object('id', u.id, 'name' , u.name)) 
              from ${schema}.${USER} u where u.id =ANY(t.curator)) as curators `;

    sql = `SELECT t.*,ti."totalSubscribers"::int,
             ti."totalCollaborations"::int
             FROM (select t.*,
             json_agg(json_build_object('id',tc.id,'title', tc.title, 'position' , tc.position, 'width' , tc.width)) as columns,                       
             ${voteSql},
             ${tagSql},        
             ${curatorSql}        
            from ${schema}."${TABLE}" t 
            join ${schema}."${TABLE_COLUMN}" tc on tc."tableId"=t.id                                      
            where t.id=${id} ${whereCond}
            group by t.id ${condSql})t
            LEFT join ${schema}."${TABLE_INFO}" ti on ti."tableId"=t.id`;

    return sequelize
      .query(sql, {
        bind: [],
        type: sequelize.QueryTypes.SELECT
      })
      .then(data => {
        if (_.isEmpty(data)) throw new Error(`No table detail found`);
        return data[0];
      })
      .catch(err => {
        throw err;
      });
  }

  /**
   * Find table cells exists
   * @param cellIds
   * @returns {Promise|*|PromiseLike<T>|Promise<T>}
   */
  findCells(cellIds) {
    let { TableCells } = this.app.orm;

    return TableCells.findAll({ where: { id: { $in: cellIds } } }).then(
      cells => {
        if (_.isEmpty(cells)) throw new Error(`No cells found`);

        cells = _.map(cells, d => {
          return d.toJSON();
        });
        return cells;
      }
    );
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
      order,
      whereCond = ``;
    let cond = [],
      params = [];

    if (fields.hasOwnProperty("isPublished")) {
      cond.push(`t."isPublished" = $${params.length + 1}`);
      params.push(fields.isPublished);
    }
    whereCond = cond.length ? " WHERE " + cond.join(" AND ") : "";

    if (fields.hasOwnProperty("sort")) {
      order = fields.order === "asc" ? "ASC" : "DESC";
      condSql = `${condSql} ORDER BY "${fields.sort}" ${order}`;
    }
    if (parseInt(fields.start)) condSql += " OFFSET " + fields.start;
    if (parseInt(fields.limit)) condSql += " LIMIT " + fields.limit;
    let sql = `select t.*,ti."totalSubscribers",ti."totalCollaborations"                
           from ${schema}.${TABLE} t 
           left join ${schema}.${TABLE_INFO} ti on ti."tableId"= t.id 
           ${whereCond}
          ${condSql}`;

    return sequelize
      .query(sql, {
        bind: params,
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
   * get row in table
   * @param rowId
   * @returns {Promise|*|PromiseLike<T>|Promise<T>}
   */
  getRow(rowId) {
    let { TableRow } = this.app.orm;

    return TableRow.findOne({ where: { id: rowId } }).then(data => {
      if (_.isEmpty(data)) throw new Error(`Table row not found!.`);
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
  updateRowCells(fields) {
    let { sequelize } = this.app.orm.User;
    let { TABLE_CELL } = this.app.config.constants.tables;
    let { schema } = sequelize.options;

    let values = `VALUES `;
    let date = moment().format();

    _.map(fields.rowColumns, (data, index) => {
      if (index > 0) values = `${values},`;
      values = `${values} (${data.id},'${data.content}','${
        data.link
      }','${date}')`;
    });

    let sql = `UPDATE ${schema}.${TABLE_CELL} as t set
                 content = c.content,
                 link = c.link, 
                 "updatedAt" = c.updatedAt::timestamp
              FROM (
                 ${values}
              ) AS c(id, content, link,updatedAt)
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
    let { rowStatusType } = this.app.config.constants;
    let data = [];

    //Todo change from content

    _.map(fields.data, f => {
      data.push({
        cellId: f.id,
        userId: f.userId,
        tableRowId: f.tableRowId,
        to: f.to,
        from: f.from,
        comment: f.comment,
        status: fields.status || rowStatusType.PENDING
      });
    });

    return ChangeRequest.bulkCreate(data, { returning: true }).then(data => {
      data = _.map(data, kw => {
        return kw.toJSON();
      });
      return data;
    });
  }

  /**
   * Get collaborations list
   * @param fields
   * @returns {Promise<T>}
   */
  getCollaborationsList(fields) {
    let { sequelize } = this.app.orm.Table;
    let { collaborateTypes, votesType } = this.app.config.constants;
    let {
      TABLE_CELL,
      TABLE,
      TABLE_ROW,
      TABLE_COLUMN,
      VOTE
    } = this.app.config.constants.tables;
    let { schema } = sequelize.options;
    let sql = ``,
      condSql = ``,
      whereCond = ``,
      voteSql = ``;
    voteSql = `(SELECT count(*)::int from ${schema}.${VOTE} where "itemId"=tr.id AND "type"='${
      votesType.TABLE_ROW
    }') as votes`;

    if (fields.status) whereCond = ` AND status='${fields.status}'`;

    if (fields.hasOwnProperty("start")) condSql = ` OFFSET ${fields.start}`;
    if (fields.limit) condSql = `${condSql} LIMIT ${fields.limit}`;

    if (fields.type == collaborateTypes.SUBMITTED) {
      sql = `select tr.*,t.owner,t.title,t.description,
                 json_agg(json_build_object('columnId', trc."columnId", 'content' , trc.content, 'link' , trc.link)) as cells,
                 json_agg(json_build_object('id',tc.id,'title', tc.title, 'position' , tc.position, 'width' , tc.width)) as columns,
                 ${voteSql} 
                from ${schema}."${TABLE}" t 
                join ${schema}."${TABLE_COLUMN}" tc on tc."tableId"=t.id
                join ${schema}."${TABLE_ROW}" tr on tr."tableId"=t.id 
                left join ${schema}."${TABLE_CELL}" trc on trc."rowId" =tr.id 
                where tr."createdBy"=${fields.userid} ${whereCond}
                group by tr.id,t.title,t.owner,t.description 
                order by tr."createdAt" asc
                ${condSql}`;
    } else {
      sql = `select tr.*,t.owner,t.title,t.description,
                 json_agg(json_build_object('columnId', trc."columnId", 'content' , trc.content, 'link' , trc.link)) as cells,
                 json_agg(json_build_object('id',tc.id,'title', tc.title, 'position' , tc.position, 'width' , tc.width)) as columns,
                 ${voteSql}  
                from ${schema}."${TABLE}" t 
                join ${schema}."${TABLE_COLUMN}" tc on tc."tableId"=t.id
                join ${schema}."${TABLE_ROW}" tr on tr."tableId"=t.id 
                left join ${schema}."${TABLE_CELL}" trc on trc."rowId" =tr.id 
                where t."owner"=${fields.userid} ${whereCond}
                group by tr.id,t.title,t.owner,t.description 
                order by tr."createdAt" desc
                ${condSql}`;
    }

    return sequelize
      .query(sql, {
        bind: [],
        type: sequelize.QueryTypes.SELECT
      })
      .then(rows => {
        if (_.isEmpty(rows)) throw new Error(`No list found`);
        return rows;
      })
      .catch(err => {
        throw err;
      });
  }

  /**
   * Get collaborations list
   * @param fields
   * @returns {Promise<T>}
   */
  getTableContentList(fields) {
    let { sequelize } = this.app.orm.Table;
    let { votesType, rowStatusType } = this.app.config.constants;
    let {
      TABLE_CELL,
      TABLE,
      TABLE_ROW,
      TABLE_COLUMN,
      VOTE
    } = this.app.config.constants.tables;
    let { schema } = sequelize.options;
    let sql = ``,
      condSql = ``,
      whereCond = ``,
      voteSql = ``;
    voteSql = `(SELECT count(*)::int from ${schema}.${VOTE} where "itemId"=tr.id AND "type"='${
      votesType.TABLE_ROW
    }') as votes`;

    fields.status = fields.status || rowStatusType.APPROVED;

    if (fields.status) whereCond = ` AND status='${fields.status}'`;

    if (fields.hasOwnProperty("start")) condSql = ` OFFSET ${fields.start}`;
    if (fields.limit) condSql = `${condSql} LIMIT ${fields.limit}`;

    sql = `select tr.*,
                 json_agg(json_build_object('columnId', trc."columnId", 'content' , trc.content, 'link' , trc.link)) as cells,                 
                 ${voteSql}  
                from ${schema}."${TABLE}" t 
                join ${schema}."${TABLE_COLUMN}" tc on tc."tableId"=t.id
                join ${schema}."${TABLE_ROW}" tr on tr."tableId"=t.id 
                join ${schema}."${TABLE_CELL}" trc on trc."rowId" =tr.id 
                where t."id"=${fields.id} ${whereCond}
                group by tr.id
                order by tr."createdAt" asc
                ${condSql}`;

    return sequelize
      .query(sql, {
        bind: [],
        type: sequelize.QueryTypes.SELECT
      })
      .then(rows => {
        if (_.isEmpty(rows)) throw new Error(`No row list found`);
        return rows;
      })
      .catch(err => {
        throw err;
      });
  }
};
