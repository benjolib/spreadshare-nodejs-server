"use strict";

const Controller = require("trails/controller");
const _ = require("lodash");
const fs = require("fs");
const uuidv4 = require("uuid/v4");

/**
 * @module ProfileController
 * @description all profile related apis.
 */
module.exports = class ProfileController extends Controller {
  /**
   * Get user profile detail
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async getProfile(req, res) {
    let { ProfileService } = this.app.services;
    let user = req.user; // login user

    try {
      let profile = await ProfileService.get(user.id);
      return res.json({
        flag: true,
        data: profile,
        message: `User profile detail found`
      });
    } catch (e) {
      return res.json({
        flag: false,
        data: {},
        message: `Couldn't get user profile , ${e.message}`
      });
    }
  }

  /**
   * Get user connections detail
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async getUserConnections(req, res) {
    let { ProfileService } = this.app.services;
    let params = req.params;
    let user = req.user; // login user

    try {
      let connections = await ProfileService.getConnections(params.userid);
      return res.json({
        flag: true,
        data: connections,
        message: `User connections detail found`
      });
    } catch (e) {
      return res.json({
        flag: false,
        data: {},
        message: `Couldn't get user connections , ${e.message}`
      });
    }
  }

  /**
   * add/update user connections
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async upsertConnections(req, res) {
    let { ProfileService } = this.app.services;
    let body = req.body;
    let user = req.user; // login user
    let connections = {};
    let model = _.clone(body);

    //Check user connections exists
    try {
      connections = await ProfileService.getConnections(user.id);
    } catch (e) {
      //Not handling error here
    }

    //Add/update user connections
    try {
      if (_.isEmpty(connections))
        await ProfileService.addConnections(model, user.id);
      else await ProfileService.updateConnections(model, user.id);

      return res.json({
        flag: true,
        message: `User connections added successfully.`
      });
    } catch (e) {
      return res.json({ flag: false, message: e.message });
    }
  }

  /**
   * Update user profile detail
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async updateProfile(req, res) {
    let { ProfileService } = this.app.services;
    let updatableFields = [
      "name",
      "email",
      "mobile",
      "handle",
      "emailSettings",
      "username",
      "password",
      "description",
      "location",
      "locationId",
      "tagline",
      "website",
      "image"
    ];
    let body = req.body;
    let user = req.user;
    let model = {};

    //Update basic profile detail to user table
    try {
      _.map(body, (value, key) => {
        if (_.includes(updatableFields, key)) {
          model[key] = value;
        }
      });

      if (_.isEmpty(model))
        throw new Error(`Can not get body to update profile!`);

      await ProfileService.update(model, user.id);
    } catch (e) {
      return res.json({
        flag: false,
        message: `Couldn't update user profile,${e.message}`
      });
    }

    if (!body.locationId)
      return res.json({
        flag: true,
        message: `User profile updated successfully!`
      });

    //Update user location
    try {
      await ProfileService.upsertUserLocation({
        userId: user.id,
        locationId: body.locationId
      });
      return res.json({
        flag: true,
        message: `User profile updated successfully!`
      });
    } catch (e) {
      return res.json({
        flag: false,
        message: `Couldn't update user location detail,${e.message}`
      });
    }
  }

  /**
   * Upload base64 image
   * @param req
   * @param res
   */
  uploadImage(req, res) {
    let body = req.body;
    let base64String = body.image;

    // Remove header
    let base64Image = base64String.split(";base64,").pop();
    let dir = "./public";
    let extension = base64String.substring(
      "data:image/".length,
      base64String.indexOf(";base64")
    );
    let fileName = uuidv4();

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    let filepath = `${fileName}.${extension}`;
    fs.writeFile(
      `${dir}/${filepath}`,
      base64Image,
      { encoding: "base64" },
      (e, data) => {
        if (e) return res.json({ flag: false, message: `${e.message}` });

        return res.json({
          flag: true,
          data: `/${filepath}`,
          message: `file uploaded successfully!`
        });
      }
    );
  }
};
