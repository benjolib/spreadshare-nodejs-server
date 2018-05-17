"use strict";

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  let schema = db.schema;
  let sql = `
    CREATE OR REPLACE FUNCTION ${schema}.table_view_inc() 
    RETURNS trigger
    LANGUAGE plpgsql
    AS $function$
    BEGIN
    EXECUTE 'UPDATE ' || TG_TABLE_SCHEMA || '.tableinfo SET "totalView" = "totalView"+1 WHERE "tableId" = $1."tableId"' USING NEW;
    RETURN NULL;
    END
    $function$;
    
    CREATE TRIGGER incr_table_view AFTER INSERT ON ${schema}.tableview
    FOR EACH ROW EXECUTE procedure ${schema}.table_view_inc();
    `;

  return db.runSql(sql);
};

exports.down = function(db) {
  let schema = db.schema;
  let sql = `  DROP TRIGGER IF EXISTS incr_table_view ON ${schema}.tableview;
               DROP FUNCTION IF EXISTS ${schema}.table_view_inc() ;`;

  return db.runSql(sql);
};

exports._meta = {
  version: 1
};
