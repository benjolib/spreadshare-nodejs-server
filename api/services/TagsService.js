"use strict";

const Service = require("trails/service");
const _ = require("lodash");
/**
 * @module TagsService
 * @description tags
 */
module.exports = class TagsService extends Service {
  /**
   * add Tags
   * @param fields
   * @returns {*|PromiseLike<T>|Promise<T>}
   */
  create(fields) {
    let { Tags } = this.app.orm;

    return Tags.create(fields).then(data => {
      if (_.isEmpty(data)) throw new Error(`Tags not created!.`);
      return data.toJSON();
    });
  }

  /**
   * remove tags
   * @param id
   * @returns {*|PromiseLike<T>|Promise<T>}
   */
  destroy(id) {
    let { Tags } = this.app.orm;

    return Tags.destroy({ where: { id } }).then(data => {
      return data;
    });
  }

  /**
   * find list of all tags
   * @param fields
   * @returns {*|PromiseLike<T>|Promise<T>}
   */
  find(fields) {
    let { Tags } = this.app.orm;
    let criteria = {
      title: {
        $like: "%fields.search%"
      }
    };

    return Tags.findAll({
      where: {
        title: {
          $like: `%${fields.search}`
        }
      },
      offset: parseInt(fields.start),
      limit: parseInt(fields.limit)
    }).then(tags => {
      if (_.isEmpty(tags)) throw new Error(`Tags not found!.`);
      return _.map(tags, tag => {
        return tag.toJSON();
      });
    });
  }
};
