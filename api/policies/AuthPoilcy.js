"use strict";

const Policy = require("trails/policy");
const _ = require("lodash");

/**
 * @module AuthPoilcy
 * @description check validation
 */
module.exports = class AuthPoilcy extends Policy {
  /**
   * Check if user is logged in or not
   * @param req
   * @param res
   * @param next
   * @returns {*}
   */
  async checkTable(req, res, next) {
    let { TableService } = this.app.services;
    let model = req.body;
    let params = req.params;

    let tableId = model.tableId || params.id;

    if (!tableId)
      return res
        .status(400)
        .json({ flag: false, message: `tableId parameter missing!` });

    try {
      let table = await TableService.find(tableId); //check table is available or not
      req.table = table;
      next();
    } catch (e) {
      return res.status(400).json({
        flag: true,
        message: `Table not found ,${e.message}`,
        data: {}
      });
    }
  }

  /**
   * Load table row data
   * @param req
   * @param res
   * @param next
   * @returns {Promise<void>}
   */
  async loadTableRow(req, res, next) {
    let { TableService } = this.app.services;
    let model = req.body;
    let params = req.params;

    let tableRowId = model.rowId || params.rowid || params.id;

    if (!tableRowId)
      return res
        .status(400)
        .json({ flag: false, message: `Rowid parameter missing!` });

    try {
      let tableRow = await TableService.getRow(tableRowId); //check table is available or not
      req.tableRow = tableRow;
      next();
    } catch (e) {
      return res.status(400).json({
        flag: true,
        message: `Couldn't find data ,${e.message}`,
        data: {}
      });
    }
  }

  /**
   * Load table row cells detail
   * @param req
   * @param res
   * @param next
   * @returns {Promise<void>}
   */
  async loadCells(req, res, next) {
    let { TableService } = this.app.services;
    let model = req.body;
    let params = req.params;

    let rowColumns = model.rowColumns;

    if (!rowColumns.length) next();

    let cellIds = _.map(rowColumns, "id");

    try {
      let cells = await TableService.findCells(cellIds); //check cells are available
      req.tableCells = cells;
      next();
    } catch (e) {
      return res.status(400).json({
        flag: true,
        message: `Table row cells not found ,${e.message}`,
        data: {}
      });
    }
  }

  /**
   * Check Table is exist and check table owner
   * @param req
   * @param res
   * @param next
   * @returns {*}
   */
  async checkTableOwner(req, res, next) {
    let { TableService } = this.app.services;
    let model = req.body;
    let user = req.user;
    let params = req.params;

    let tableId = model.tableId || params.id;

    if (!tableId)
      return res
        .status(400)
        .json({ flag: false, message: `tableId parameter missing!` });

    try {
      let table = await TableService.find(tableId); //check table is available or not
      req.table = table;

      if (parseInt(table.owner) != user.id)
        throw new Error(`Only owner have permission for this`);

      next();
    } catch (e) {
      return res.status(400).json({
        flag: true,
        message: `Table not found ,${e.message}`,
        data: {}
      });
    }
  }
};
