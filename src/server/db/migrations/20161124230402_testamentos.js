
exports.up = function(knex, Promise) {
  return knex.schema.createTable('testamentos', (table) => {
      table.increments('tes_id');
      table.string('tes_nome').notNullable();
  })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('testamentos');
};