
exports.up = function(knex, Promise) {
  return knex.schema.createTable('livros', (table) => {
      table.increments('liv_id');
      table.integer('liv_text_id').notNullable();
      table.integer('liv_posicao').notNullable();
      table.string('liv_nome').notNullable();
  })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('livros');
};