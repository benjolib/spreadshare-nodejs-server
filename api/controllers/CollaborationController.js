"use strict";

const Controller = require("trails/controller");

/**
 * @module CollaborationController
 * @description all collaborations apis.
 */
module.exports = class CollaborationController extends Controller {
  /**
   * Revoke submission
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async revokeSubmission(req, res) {
    let { TableService, NotificationService } = this.app.services;
    let { rowStatusType, notificationType } = this.app.config.constants;
    let params = req.params;
    let user = req.user;
    let tableRow = req.tableRow;
    let id = parseInt(params.rowid);

    //Check tableRow status & its Owner
    if (tableRow.createdBy != user.id)
      res.json({
        flag: false,
        message: `You have no permission to revoke this submission`
      });
    else if (tableRow.status != rowStatusType.PENDING) {
      let status =
        tableRow.status == rowStatusType.APPROVED ? "Approved" : "rejected";
      return res.json({
        flag: false,
        message: `This submission is already ${status}, please submit delete request to delete this row`
      });
    }

    //Revoke submission
    try {
      await TableService.updateTableRow(
        { status: rowStatusType.REVOKED, updatedBy: user.id },
        id
      );
      res.json({
        flag: true,
        message: `Your submission has been accepted!`
      });
    } catch (e) {
      return res.json({
        flag: false,
        message: `Couldn't update detail, ${e.message}`
      });
    }
    try {
      let fields = {
        createdBy: user.id,
        notificationType: notificationType.COLLABORATE_UPDATE_STATUS,
        text: `Update table row status by`,
        userId: tableRow.updatedBy
      };
      await NotificationService.create(fields);
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * Get collaborations list (Submitted/Received)
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async list(req, res) {
    let { TableService } = this.app.services;
    let model = req.body;
    let user = req.user;
    let condition = {};

    let start = parseInt(model.start) || 0;
    let limit = parseInt(model.limit) || 10;
    let type = model.type;
    let status = model.status;

    try {
      condition = {
        start,
        limit,
        type,
        status,
        userid: user.id
      };
      let data = await TableService.getCollaborationsList(condition);
      return res.json({ flag: true, data: data });
    } catch (e) {
      return res.json({ flag: false, data: [] });
    }
  }
};
