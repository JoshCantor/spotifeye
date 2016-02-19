var env = process.env.NODE_ENV || 'development',
	config = require('../knexfile')[env];
module.exports = require('knex')(config);