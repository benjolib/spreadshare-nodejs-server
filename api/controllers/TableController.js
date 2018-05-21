"use strict";

const Controller = require("trails/controller");
const _ = require("lodash");
const moment = require("moment");
/**
 * @module TableController
 * @description table.
 */
module.exports = class TableController extends Controller {
  /**
   * create table
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async create(req, res) {
    let model = req.body;
    let { TableService } = this.app.services;
    let user = req.user;
    try {
      let data = {
        owner: user.id,
        title: model.title,
        tags: model.tags,
        tagline: model.tagline,
        image: model.image,
        description: model.description,
        isThumbnail: model.isThumbnail,
        curator: model.curator,
        isPublished: model.isPublished
      };

      let table = await TableService.create(data);
      return res.json({
        flag: true,
        data: table,
        message: "Success",
        code: 200
      });
    } catch (e) {
      return res.json({
        flag: false,
        data: e,
        message: e.message,
        code: 500
      });
    }
  }

  /**
   * add column
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async addColumn(req, res) {
    let model = req.body;
    let { TableService } = this.app.services;
    let user = req.user;
    let data = {
      tableId: model.tableId,
      userId: user.id,
      title: model.title,
      position: model.position,
      width: model.width
    };

    try {
      let column = await TableService.addColumn(data);
      return res.json({
        flag: true,
        data: column,
        message: "Success",
        code: 200
      });
    } catch (e) {
      return res.json({
        flag: false,
        data: e,
        message: e.message,
        code: 500
      });
    }
  }

  /**
   * add multiple column
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async addMultipleColumns(req, res) {
    let model = req.body;
    let { TableService } = this.app.services;
    let user = req.user;
    let data = {
      tableId: model.tableId,
      data: []
    };

    //map column with tableId
    _.map(model.data, d => {
      data.data.push({
        tableId: model.tableId,
        userId: user.id,
        title: d.title,
        position: d.position,
        width: d.width
      });
    });

    try {
      let columns = await TableService.addMultipleColumns(data);
      return res.json({
        flag: true,
        data: columns,
        message: "Success",
        code: 200
      });
    } catch (e) {
      return res.json({
        flag: false,
        data: e,
        message: e.message,
        code: 500
      });
    }
  }

  /**
   * update column
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async updateColumn(req, res) {
    let params = req.params;
    let model = req.body;
    let id = parseInt(params.id);
    let { TableService } = this.app.services;

    try {
      let column = await TableService.updateColumn(model, id);
      return res.json({
        flag: true,
        data: column,
        message: "Success",
        code: 200
      });
    } catch (e) {
      return res.json({
        flag: false,
        data: e,
        message: e.message,
        code: 500
      });
    }
  }

  /**
   * remove column
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async removeColumn(req, res) {
    let params = req.params;
    let id = parseInt(params.id);
    let { TableService } = this.app.services;
    try {
      let column = await TableService.removeColumn(id);
      return res.json({
        flag: true,
        data: column,
        message: "Success",
        code: 200
      });
    } catch (e) {
      return res.json({
        flag: false,
        data: e,
        message: e.message,
        code: 500
      });
    }
  }

  /**
   * update table
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async update(req, res) {
    let params = req.params;
    let model = req.body;
    let id = parseInt(params.id);
    let { TableService } = this.app.services;

    try {
      let table = await TableService.update(model, id);
      //todo Update column pending
      return res.json({
        flag: true,
        data: table,
        message: "Success",
        code: 200
      });
    } catch (e) {
      return res.json({
        flag: false,
        data: e,
        message: e.message,
        code: 500
      });
    }
  }

  /**
   * table published
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async publish(req, res) {
    let params = req.params;
    let model = req.body;
    let id = parseInt(params.id);
    let { TableService } = this.app.services;
    let time = new Date().getTime();
    let data = {
      isPublished: model.isPublished,
      publishedAt: time
    };
    try {
      let table = await TableService.update(data, id);
      return res.json({
        flag: true,
        data: table,
        message: "Success",
        code: 200
      });
    } catch (e) {
      return res.json({
        flag: false,
        data: e,
        message: e.message,
        code: 500
      });
    }
  }

  /**
   * get table details
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async tableDetail(req, res) {
    let { TableService } = this.app.services;
    let params = req.params;
    let id = parseInt(params.id);

    try {
      let table = await TableService.find(id);
      return res.json({
        flag: true,
        data: table,
        message: "Success",
        code: 200
      });
    } catch (e) {
      return res.json({
        flag: false,
        data: e,
        message: e.message,
        code: 500
      });
    }
  }

  /**
   * remove table
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async remove(req, res) {
    let params = req.params;
    let id = parseInt(params.id);
    let { TableService } = this.app.services;
    try {
      let table = await TableService.remove(id);
      return res.json({
        flag: true,
        data: table,
        message: "Success",
        code: 200
      });
    } catch (e) {
      return res.json({
        flag: false,
        data: e,
        message: e.message,
        code: 500
      });
    }
  }

  /**
   * get list of table
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async list(req, res) {
    let { TableService } = this.app.services;
    let { tableSortType } = this.app.config.constants;
    let body = req.body;
    let defaultSort = {};
    defaultSort[tableSortType.SPREADS] = "desc";

    let sort = body.sort && !_.isEmpty(body.sort) ? body.sort : defaultSort;
    let sortKey = Object.keys(sort)[0];

    let model = {
      start: body.start,
      limit: body.limit,
      sort: sortKey,
      order: sort[sortKey],
      isPublished: true
    };
    try {
      let table = await TableService.findPopular(model);
      return res.json({
        flag: true,
        data: table,
        message: "Success",
        code: 200
      });
    } catch (e) {
      console.log(e);
      return res.json({
        flag: false,
        data: e,
        message: e.message,
        code: 500
      });
    }
  }

  /**
   * adding row in particular table
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async addRow(req, res) {
    let { TableService } = this.app.services;
    let { tableRowActionType } = this.app.config.constants;
    let model = req.body;
    let user = req.user;
    let data = {
      tableId: model.tableId,
      createdBy: user.id,
      action: tableRowActionType.SUBMITTED
    };

    try {
      let table = await TableService.find(model.tableId); //check table is available or not
      let id = parseInt(user.id);
      if (id == table.owner) {
        data.status = "A";
      }

      let row = await TableService.addrow(data); //create table row

      let field = _.map(model.rowColumns, rc => {
        return _.extend({}, rc, { rowId: row.id, userId: user.id });
      });

      let cell = await TableService.addTableCellInBulks(field); //create table cell
      row.column = cell;
      return res.json({
        flag: true,
        data: row,
        message: "Table row created!",
        code: 200
      });
    } catch (e) {
      return res.json({
        flag: false,
        data: e,
        message: e.message,
        code: 500
      });
    }
  }

  /**
   * Update table row with with table cells
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async updateTableRow(req, res) {
    let { TableService } = this.app.services;
    let { tableRowActionType, rowStatusType } = this.app.config.constants;
    let model = req.body;
    let user = req.user;
    let table = req.table;
    let id = parseInt(model.rowId);
    let tableRowCells = req.tableCells;
    let message;

    try {
      _.map(model.rowColumns, cell => {
        let existCell = _.find(tableRowCells, { id: cell.id });
        cell.from = existCell.content;
      });

      //Add change request for cells
      let cellData = _.map(model.rowColumns, c => {
        return {
          id: c.id,
          userId: user.id,
          tableRowId: id,
          from: c.from,
          to: c.content || c.link,
          comment: c.comment
        };
      });

      //Check owner deleting table row then direct delete it
      if (user.id == table.owner) {
        //Make entry in changeRequest table so that we can have history record for this row
        let changeRequests = await TableService.addChangeRequest({
          data: cellData,
          status: rowStatusType.APPROVED
        });

        await TableService.updateRowCells({ rowColumns: model.rowColumns });
        await TableService.updateTableRow({ updatedAt: moment().format() }, id);

        message = "Row cell updated successfully!";
      } else {
        //Make delete request entry in tableRow
        let data = {
          tableId: model.tableId,
          rowId: model.rowId,
          createdBy: user.id,
          action: tableRowActionType.UPDATED
        };

        let row = await TableService.addrow(data); //create table row
        let changeRequests = await TableService.addChangeRequest({
          data: cellData
        });
        message =
          "Your update request has been added! Please wait for approval.";
      }

      return res.json({
        flag: true,
        message: message,
        code: 200
      });
    } catch (e) {
      return res.json({
        flag: false,
        data: e,
        message: e.message,
        code: 500
      });
    }
  }

  /**
   * delete Table Row
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async deleteTableRow(req, res) {
    let { TableService } = this.app.services;
    let { tableRowActionType } = this.app.config.constants;
    let model = req.body;
    let user = req.user;
    let table = req.table;
    let id = parseInt(model.rowId);
    let message;

    try {
      //Check owner deleting table row then direct delete it
      if (user.id == table.owner) {
        await TableService.removeTableRow(id);
        message = "Remove Row successfully!";
      } else {
        //Make delete request entry in tableRow
        let data = {
          tableId: model.tableId,
          rowId: model.rowId,
          createdBy: user.id,
          action: tableRowActionType.DELETED
        };
        let row = await TableService.addrow(data); //create table row
        console.log(`added row request`, row);
        message =
          "Your delete request has been added! Please wait for approval.";
      }

      return res.json({
        flag: true,
        message: message,
        code: 200
      });
    } catch (e) {
      return res.json({
        flag: false,
        data: e,
        message: e.message,
        code: 500
      });
    }
  }

  /**
   * Get table row-content data
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async tableData(req, res) {
    let { TableService } = this.app.services;
    let model = req.body;
    let params = req.params;
    let user = req.user;
    let table = req.table;
    let condition = {};

    let start = parseInt(model.start) || 0;
    let limit = parseInt(model.limit) || 10;
    let status = model.status;
    let tableId = params.id;

    try {
      condition = {
        start,
        limit,
        status,
        id: tableId
      };
      let data = await TableService.getTableContentList(condition);
      return res.json({ flag: true, data: data });
    } catch (e) {
      return res.json({ flag: false, data: [] });
    }
  }
};
