"use strict";

const Controller = require("trails/controller");
const _ = require("lodash");
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
      order: sort[sortKey]
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
    let model = req.body;
    let { TableService } = this.app.services;
    let user = req.user;
    let data = {
      tableId: model.tableId,
      createdBy: user.id,
      action: model.action
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
   * delete Table Row
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async deleteTableRow(req, res) {
    let params = req.params;
    let id = parseInt(params.id);
    let { TableService } = this.app.services;
    try {
      let table = await TableService.removeTableRow(id);
      return res.json({
        flag: true,
        data: table,
        message: "Remove Row successfully!",
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
   * update table row
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async updateTableRow(req, res) {
    let params = req.params;
    let model = req.body;
    let id = parseInt(params.id);
    let { TableService } = this.app.services;

    try {
      let table = await TableService.updateRow(model, id);

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
   * get History list
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async historyList(req, res) {
    let { TableService } = this.app.services;
    let { tableSortType } = this.app.config.constants;
    let body = req.body;
    let defaultSort = {};
    defaultSort[tableSortType.CREATED_AT] = "desc";

    let sort = body.sort && !_.isEmpty(body.sort) ? body.sort : defaultSort;
    let sortKey = Object.keys(sort)[0];

    let model = {
      start: body.start,
      limit: body.limit,
      sort: sortKey,
      order: sort[sortKey]
    };
    try {
      let table = await TableService.findHistory(model);
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

  async updateStatus(req, res) {
    let params = req.params;
    let model = req.body;
    let id = parseInt(params.id);
    let { TableService } = this.app.services;
    let { APPROVED } = this.app.config.constants.status;
    let status =
      model.status && !_.isEmpty(model.status) ? model.status : APPROVED;
    let user = req.user;

    let data = {
      status: status,
      updatedBy: user.id
    };
    try {
      let table = await TableService.updateRowStatus(data, id);

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
};
