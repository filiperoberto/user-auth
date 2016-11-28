
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTableIfNotExists('testamentos', (table) => {
        table.increments('tes_id');
        table.string('tes_nome').notNullable();
    }),

    knex.schema.table('livros', table => {
        table.foreign('liv_tes_id').references('testamentos.tes_id');
    })
  ])
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.table('livros',table => {
            table.dropForeign('liv_tes_id')
        }),
        knex.schema.dropTable('testamentos')

    ])
};