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
    let { rowStatusType } = this.app.config.constants;
    let user = req.user;
    let columns = [],
      tableColumns = [];
    let rows = [],
      tableRows = [];
    let cells = [],
      tableCells = [];

    try {
      //Create table
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

      //add multiple columns to table
      if (model.columns && model.columns.length) {
        _.map(model.columns, d => {
          columns.push({
            tableId: table.id,
            userId: user.id,
            title: d.title,
            position: d.position,
            width: d.width
          });
        });
        tableColumns = await TableService.addMultipleColumns({
          tableId: table.id,
          data: columns
        });
        table.columns = tableColumns;
      }

      //Create table Rows in bulk
      if (model.rows && model.rows.length) {
        if (!model.columns.length)
          return res.json({ flag: false, message: `Column required!` });

        _.map(model.rows, (d, dIndex) => {
          rows.push({
            tableId: table.id,
            createdBy: user.id,
            rowColumns: d.rowColumns,
            status: rowStatusType.APPROVED
          });
        });

        tableRows = await TableService.addMultipleRows({ data: rows });

        //Map rows with rowsId & columns Id Insert cells for all table Rows
        _.map(rows, (r, rIndex) => {
          r.id = tableRows[rIndex].id;

          _.map(r.rowColumns, (c, cIndex) => {
            r.column = tableColumns[cIndex];

            cells.push({
              rowId: r.id,
              columnId: r.column.id,
              userId: user.id,
              content: c.content,
              link: c.link
            });
          });
        });

        //create table cells in bulk
        tableCells = await TableService.addTableCellInBulks(cells);
        _.map(tableRows, tr => {
          tr.rowColumns = _.filter(tableCells, { rowId: tr.id });
        });

        table.rows = tableRows;
      }

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
   * add multiple table-content (must be by owner)
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async addMultipleRows(req, res) {
    let model = req.body;
    let { TableService } = this.app.services;
    let { rowStatusType } = this.app.config.constants;
    let user = req.user;
    let rows = [],
      tableRows = [];
    let cells = [],
      tableCells = [];

    try {
      //Create table Rows in bulk
      _.map(model.rows, (d, dIndex) => {
        rows.push({
          tableId: model.tableId,
          createdBy: user.id,
          rowColumns: d.rowColumns,
          status: rowStatusType.APPROVED
        });
      });

      tableRows = await TableService.addMultipleRows({ data: rows });

      //Map rows with rowsId & columns Id Insert cells for all table Rows
      _.map(rows, (r, rIndex) => {
        r.id = tableRows[rIndex].id;

        _.map(r.rowColumns, (c, cIndex) => {
          cells.push({
            rowId: r.id,
            columnId: c.columnId,
            userId: user.id,
            content: c.content,
            link: c.link
          });
        });
      });

      //create table cells in bulk
      tableCells = await TableService.addTableCellInBulks(cells);
      _.map(tableRows, tr => {
        tr.rowColumns = _.filter(tableCells, { rowId: tr.id });
      });

      return res.json({
        flag: true,
        data: tableRows,
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

  /**
   * Upload csv file
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  async uploadCsv(req, res) {
    let files = req.files;
    if (!files)
      return res
        .status(400)
        .json({ flag: false, message: `No files were uploaded.` });

    let file = files.sampleFile;
    let fileName =
      files.sampleFile && files.sampleFile.name ? files.sampleFile.name : null;
    let extension = fileName.split(".")[1].toLowerCase();
    let tableContents = [];

    if (extension != "csv")
      return res.json({ flag: false, message: "File must be csv file!" });

    let bufferOriginal = file.data; //Buffer.from(JSON.parse(file.data).data);

    console.log(bufferOriginal);
    let data = bufferOriginal.toString("utf8");
    console.log("after utf string", data);

    let csvData = data.split("\n");
    let columns = csvData[0].split(",");
    let allRows = csvData[1].split("\n");
    let rows = [];

    _.map(allRows, row => {
      rows.push(row.split(","));
    });

    //trim data
    columns = _.map(columns, c => {
      return { title: c.trim() };
    });

    _.map(rows, r => {
      let data = { cells: [] };
    });

    return res.json({ flag: true, data: { columns, rows } });
  }
};
