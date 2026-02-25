const knex = require("knex");
const config = require("../../knexfile");
const { Model } = require("objection");
const env = process.env.NODE_ENV || 'development';
const db = knex(config[env]);
require('../models/BaseModel');
Model.knex(db);
module.exports = db;


