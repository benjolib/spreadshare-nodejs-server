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
    CREATE OR REPLACE FUNCTION ${schema}.table_comment_inc() 
    RETURNS trigger
    LANGUAGE plpgsql
    AS $function$
    BEGIN
    IF NEW.type ='tablecomment' THEN
    EXECUTE 'UPDATE ' || TG_TABLE_SCHEMA || '.tablecomment SET "votesCount" = "votesCount"+1 WHERE "id" = $1."itemId"' USING NEW;
    END IF;
    RETURN NULL;
    END
    $function$;
    
    CREATE TRIGGER incr_table_comment AFTER INSERT ON ${schema}.vote
    FOR EACH ROW EXECUTE procedure ${schema}.table_comment_inc();`;

  return db.runSql(sql);
};

exports.down = function(db) {
  let schema = db.schema;

  let sql = `DROP TRIGGER IF EXISTS incr_table_comment ON ${schema}.vote;
             DROP FUNCTION IF EXISTS ${schema}.table_comment_inc();`;

  return db.runSql(sql);
};

exports._meta = {
  version: 1
};
