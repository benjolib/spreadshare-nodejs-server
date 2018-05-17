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
    CREATE OR REPLACE FUNCTION ${schema}.table_subscriber_inc() 
    RETURNS trigger
    LANGUAGE plpgsql
    AS $function$
    BEGIN
    IF NEW.type=='table' THEN
    EXECUTE 'UPDATE ' || TG_TABLE_SCHEMA || '.tableinfo SET totalSubscribers = totalSubscribers+1 WHERE tableid = $1.tableId' USING NEW;
    END IF;
    RETURN NULL;
    END
    $function$`;

  ` CREATE TRIGGER incr_table_subscriber AFTER INSERT ON ${schema}.tablesubscription
    FOR EACH ROW EXECUTE procedure ${schema}.table_subscriber_inc() ;`;

  return db.runSql(sql);
};

exports.down = function(db) {
  let schema = db.schema;
  let sql = `DROP TRIGGER IF EXISTS incr_table_subscriber ON ${schema}.tablesubscription;
               DROP FUNCTION IF EXISTS ${schema}.table_subscriber_inc() ;`;

  return db.runSql(sql);
};

exports._meta = {
  version: 1
};
