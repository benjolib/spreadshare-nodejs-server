"use strict";

const Controller = require("trails/controller");

/**
 * @module CollaborationController
 * @description all collaborations apis.
 */
module.exports = class CollaborationController extends Controller {
  async addDeleteRowRequest(req, res) {
    let model = req.body;
    let { TableService } = this.app.services;
    let { tableRowActionType } = this.app.config.constants;
    let user = req.user;
    let table = req.table;

    let data = {
      tableId: model.tableId,
      rowId: model.rowId,
      createdBy: user.id,
      action: tableRowActionType.DELETED
    };

    try {
      let row = await TableService.addrow(data); //create table row

      return res.json({
        flag: true,
        data: row,
        message: "Your delete request has been added!",
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
