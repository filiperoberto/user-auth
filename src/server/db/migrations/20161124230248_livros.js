
exports.up = function(knex, Promise) {
    return knex.schema.createTableIfNotExists('livros', (table) => {
        table.increments('liv_id');
        table.integer('liv_tes_id').unsigned().notNullable();
        table.integer('liv_posicao').notNullable();
        table.string('liv_nome').notNullable();
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('livros');
};