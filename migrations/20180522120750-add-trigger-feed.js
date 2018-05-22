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
             ---add table feed 
              CREATE OR REPLACE FUNCTION ${schema}.add_table_feed()
               RETURNS trigger
               LANGUAGE plpgsql
              AS $function$
                  declare
                    content varchar;
                    status varchar;
                               
                  begin
                    
                  IF NEW."isPublished"=true then
                          status:='A';
                  else 
                      status:='P';
                  end if;
                       content = '{"id":"' ||new.id || '","type":"table"}'; 	
                       INSERT INTO ${schema}.feedaction(id,"userId","itemId","itemType",contents,"feedType",status)
                       VALUES(default,NEW.owner,NEW.id,'table',content::jsonb,'created',status);                     
                      RETURN NULL;
                  END
              $function$;         
          
          ---add table-collaborate feed 
          CREATE OR REPLACE FUNCTION ${schema}.add_table_content_feed()
           RETURNS trigger
           LANGUAGE plpgsql
          AS $function$
              declare
                content varchar;
              BEGIN
                   content = '{"id":"' ||new.id || '","type":"tablerow"}'; 	
                   INSERT INTO ${schema}.feedaction(id,"userId","itemId","itemType",contents,"feedType",status)
                   VALUES(default,NEW."createdBy",NEW.id,'tablerow',content::jsonb,'collaborated','P');                     
                  RETURN NULL;
              END
          $function$;
          
          
          create trigger table_feed after insert on ${schema}."table" for each row execute procedure ${schema}.add_table_feed();
          create trigger add_table_content_feed after insert on ${schema}.tablerow for each row execute procedure ${schema}.add_table_content_feed();
        `;

  return db.runSql(sql);
};

exports.down = function(db) {
  let schema = db.schema;
  let sql = `  DROP TRIGGER IF EXISTS table_feed ON ${schema}.table;
               DROP FUNCTION IF EXISTS ${schema}.add_table_feed() ;
               
               DROP TRIGGER IF EXISTS add_table_content_feed ON ${schema}.tablerow;
               DROP FUNCTION IF EXISTS ${schema}.add_table_content_feed() ;`;

  return db.runSql(sql);
};

exports._meta = {
  version: 1
};
