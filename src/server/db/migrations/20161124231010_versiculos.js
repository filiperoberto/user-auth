
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('versiculos', (table) => {
            table.increments('ver_id');
            table.integer('ver_vrs_id').unsigned().notNullable();
            table.integer('ver_liv_id').unsigned().notNullable();
            table.integer('ver_capitulo').notNullable();
            table.integer('ver_versiculo').notNullable();
            table.string('ver_texto').notNullable();
        }),
        knex.schema.table('versiculos', table => {
            table.foreign('ver_vrs_id').references('versoes.vrs_id');
            table.foreign('ver_liv_id').references('livros.liv_id');
        })
    ])
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('versiculos');
};