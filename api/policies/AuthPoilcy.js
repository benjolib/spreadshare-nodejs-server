"use strict";

const Policy = require("trails/policy");

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

    try {
      let table = await TableService.find(tableId); //check table is available or not
      req.table = table;
      next();
    } catch (e) {
      return res
        .status(400)
        .json({
          flag: true,
          message: `Table not found ,${e.message}`,
          data: {}
        });
    }
  }
};
