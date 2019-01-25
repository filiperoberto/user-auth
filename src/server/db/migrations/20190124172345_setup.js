exports.up = function(knex, Promise) {
    return knex.schema.createTableIfNotExists('users', table => {
        table.increments('id').primary();
        table.string('username').notNullable();
        table.string('password').notNullable();
        table.string('role').notNullable().defaultTo('editor');
        table.dateTime('created');
        table.dateTime('modified');
        table.string('name');
        table.string('website');
        table.text('description');
        table.string('picture');
        table.integer('reputation').defaultTo(0);
        table.string('email');
        table.dateTime('passwordChange');
        table.integer('random');
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('users');
};