"use strict";

const Controller = require("trails/controller");

/**
 * @module VoteController
 * @description Vote controllers.
 */
module.exports = class VoteController extends Controller {
  /**
   * Add vote (Spread it)
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async addVote(req, res) {
    let { VoteService } = this.app.services;
    let user = req.user;
    let body = req.body;

    let model = {
      itemId: body.itemId,
      userId: user.id,
      type: body.type
    };

    try {
      let vote = await VoteService.create(model);
      return res.json({ flag: true, message: `Your vote added successfully!` });
    } catch (e) {
      return res.json({ flag: false, message: e.message });
    }
  }

  /**
   * Remove vote (Spread it)
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async removeVote(req, res) {
    let { VoteService } = this.app.services;
    let user = req.user;
    let body = req.body;

    let model = {
      itemId: body.itemId,
      userId: user.id,
      type: body.type
    };

    try {
      let vote = await VoteService.remove(model);
      return res.json({
        flag: true,
        message: `Your vote removed successfully!`
      });
    } catch (e) {
      return res.json({ flag: false, message: e.message });
    }
  }
};
