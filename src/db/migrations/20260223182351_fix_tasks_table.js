exports.up = function(knex) {
  return knex.schema.dropTableIfExists('taks').then(() => {
    return knex.schema.createTable('tasks', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table.string('title').notNullable();
      table.string('description');
      table.boolean('completed').defaultTo(false);
      table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
      table.timestamps(true, true);
    });
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('tasks');
};
