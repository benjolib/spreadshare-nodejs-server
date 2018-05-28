const Joi = require("joi");
const _ = require("lodash");
const Constant = require("../../config/constants");

module.exports = class TableValidator {
  create() {
    return Joi.object().keys({
      title: Joi.string().required(),
      tags: Joi.array().required(),
      tagline: Joi.string(),
      image: Joi.string(),
      description: Joi.string(),
      isThumbnail: Joi.boolean(),
      curator: Joi.array(),
      isPublished: Joi.boolean(),
      isDraft: Joi.boolean(),
      columns: Joi.array().items(
        Joi.object().keys({
          title: Joi.string().required(),
          position: Joi.number(),
          width: Joi.number()
        })
      ),
      rows: Joi.array().items(
        Joi.object().keys({
          rowColumns: Joi.array().items(
            Joi.object().keys({
              content: Joi.string(),
              link: Joi.string()
            })
          )
        })
      )
    });
  }

  update() {
    return Joi.object().keys({
      title: Joi.string().required(),
      tags: Joi.array(),
      tagline: Joi.string(),
      image: Joi.string(),
      description: Joi.string(),
      isThumbnail: Joi.boolean(),
      curator: Joi.array(),
      isPublished: Joi.boolean(),
      isDraft: Joi.boolean()
    });
  }

  addColumn() {
    return Joi.object().keys({
      tableId: Joi.number().required(),
      title: Joi.string().required(),
      position: Joi.number(),
      width: Joi.number()
    });
  }

  addMultipleColumns() {
    return Joi.object().keys({
      tableId: Joi.number().required(),
      data: Joi.array().items(
        Joi.object().keys({
          title: Joi.string().required(),
          position: Joi.number(),
          width: Joi.number()
        })
      )
    });
  }

  publish() {
    return Joi.object().keys({
      isPublished: Joi.boolean()
    });
  }

  list() {
    return Joi.object().keys({
      start: Joi.number(),
      limit: Joi.number(),
      sort: Joi.object()
    });
  }

  search() {
    return Joi.object().keys({
      start: Joi.number(),
      limit: Joi.number(),
      sort: Joi.object(),
      term: Joi.string().required()
    });
  }

  addRow() {
    return Joi.object().keys({
      tableId: Joi.number(),
      rowColumns: Joi.array()
    });
  }

  addRowMultiple() {
    return Joi.object().keys({
      tableId: Joi.number().required(),
      rows: Joi.array()
        .items(
          Joi.object().keys({
            rowColumns: Joi.array().items(
              Joi.object().keys({
                content: Joi.string(),
                link: Joi.string(),
                columnId: Joi.number().required()
              })
            )
          })
        )
        .required()
    });
  }

  updateTableRow() {
    return Joi.object().keys({
      tableId: Joi.number().required(),
      rowId: Joi.number().required(),
      rowColumns: Joi.array().required()
    });
  }

  deleteTableRow() {
    return Joi.object().keys({
      rowId: Joi.number().required(),
      tableId: Joi.number().required()
    });
  }

  getTableContentList() {
    let { rowStatusType } = Constant;
    return Joi.object().keys({
      start: Joi.number(),
      limit: Joi.number(),
      status: Joi.any().valid(_.values(rowStatusType))
    });
  }

  getCollaborateList() {
    let { rowStatusType, collaborateTypes } = Constant;
    return Joi.object().keys({
      start: Joi.number(),
      limit: Joi.number(),
      status: Joi.any().valid(_.values(rowStatusType)),
      type: Joi.any()
        .valid(_.values(collaborateTypes))
        .required()
    });
  }

  updateStatus() {
    let { rowStatusType } = Constant;
    return Joi.object().keys({
      status: Joi.any().valid(_.values(rowStatusType))
    });
  }

  historyList() {
    return Joi.object().keys({
      start: Joi.number(),
      limit: Joi.number(),
      sort: Joi.object()
    });
  }
};
