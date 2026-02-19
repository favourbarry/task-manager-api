const knex = require("knex");
const config = require("../../knexfile");
const { Model } = require("objection");

const db = knex(config.development);

Model.knex(db);
module.exports = db;


