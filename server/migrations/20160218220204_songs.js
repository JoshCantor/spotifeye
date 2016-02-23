exports.up = function(knex, Promise) {
  return Promise.all([
  	knex.schema.createTable("users", function(table){
  		table.string('user_id').primary(); //spotify_id
  		table.string('display_name');
  		table.string('profile_pic');
  	}),
  	knex.schema.createTable("tracks", function(table){
      table.increments();
		table.string("track_id");
		table.string('track_name');
		table.integer('track_popularity');
		table.string('album_art');
		table.string('preview_url');
		table.integer('echonest_category');
  	}),
  	knex.schema.createTable("savedtracks", function(table){
  		// table.primary();
  		table.string('user_id').references('user_id').inTable('users');
  		table.string('track_id');
  	})])
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('user');
};