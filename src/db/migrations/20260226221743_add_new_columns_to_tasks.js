const { table } = require("../../config/knex");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('tasks', (table) => {
    table.string('priority').defaultTo('medium');
    table.timestamp('due_date');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('tasks', (table) => {
    table.dropColumn('priority');
    table.dropColumn('due_date');
  });
};
