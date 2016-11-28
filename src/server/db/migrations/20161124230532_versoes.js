
exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('versoes', (table) => {
      table.increments('vrs_id');
      table.string('vrs_nome').notNullable();
      table.string('vrs_abbr');
  })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('versoes');
};