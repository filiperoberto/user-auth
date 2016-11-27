
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('versoes', (table) => {
      table.increments('vrs_id');
      table.string('vrs_nome').notNullable();
  })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('versoes');
};