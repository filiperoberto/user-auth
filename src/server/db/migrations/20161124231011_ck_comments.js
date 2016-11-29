
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTableIfNotExists('ck_comments', (table) => {
            table.increments('id');
            table.text('comment');
            table.integer('version_id').unsigned().notNullable();
            table.dateTime('created');
            table.dateTime('modified');
            table.integer('visible').defaultTo(1);
        }),
        knex.schema.table('ck_comments', table => {
            table.primary(['id']);
        })
    ])
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('ck_comments');
};