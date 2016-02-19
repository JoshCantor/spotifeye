exports.up = function(knex, Promise) {
  return knex.schema.createTable('songs', function(table) {
  	table.increments().primary(); 
  	table.json("json_data");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('songs');
};