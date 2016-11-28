
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTableIfNotExists('livros', (table) => {
            table.increments('liv_id');
            table.integer('liv_tes_id').unsigned().notNullable();
            table.integer('liv_posicao').notNullable();
            table.string('liv_nome').notNullable()
        }),
        knex.schema.table('livros',table => {
            table.string('liv_abbr').notNullable()
        }),
        knex.schema.table('livros',table => {
            table.index('liv_abbr');
        })
    ])
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('livros');
};