
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTableIfNotExists('ck_comments', (table) => {
            table.increments('id').primary();
            table.text('comment');
            table.integer('user_id').unsigned().notNullable();
            table.integer('version_id').unsigned().notNullable();
            table.dateTime('created');
            table.dateTime('modified');
            table.integer('visible').defaultTo(1);
        }),
        knex.schema.createTableIfNotExists('ck_conjuges',table => {
            table.integer('marido').unsigned();
            table.integer('mulher').unsigned();
        }),
        knex.schema.createTableIfNotExists('ck_pessoas',table => {
            table.increments('id').primary();
            table.string('nome').notNullable();
            //TODO - remover as seguintes colunas em migração posterior
            table.integer('idade_morte').unsigned();
            table.integer('pai').unsigned();
            table.integer('mae').unsigned();
            table.integer('idade_pai_nascimento').unsigned();
            table.integer('idade_mae_nascimento').unsigned();
            table.boolean('sexo');
            table.boolean('linhagem_de_jesus');
            table.dateTime('created');
            table.dateTime('modified');
        }),
        knex.schema.createTableIfNotExists('ck_post_to_tag',table => {
            table.integer('post').unsigned().notNullable();
            table.integer('tag').unsigned().notNullable();
        }),
        knex.schema.createTableIfNotExists('ck_posts', table => {
            table.increments('id').primary();
            table.string('title');
            table.text('body');
            table.dateTime('created');
            table.dateTime('modified');
            table.boolean('public').defaultTo(0);
            table.integer('user_id');
        }),
        knex.schema.createTableIfNotExists('ck_tags',table => {
            table.increments('id').primary();
            table.string('classe').notNullable().defaultTo('0');
            table.string('texto').notNullable();
        }),
        knex.schema.createTableIfNotExists('ck_users',table => {
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
            table.integer('reputition').defaultTo(0);
            table.string('email');
        }),
        knex.schema.createTableIfNotExists('ck_versions',table => {
            table.increments('id').primary();
            table.integer('version_number').notNullable().defaultTo(1);
            table.text('citacoes');
            table.text('descricao');
            table.text('sinonimos');
            table.dateTime('created');
            table.dateTime('modified');
            table.integer('aprovada').defaultTo(0);
            table.integer('id_pessoa').unsigned().notNullable();
            table.integer('user_id').unsigned().notNullable();

            table.integer('idade_morte').unsigned();
            table.integer('idade_pai_nascimento').unsigned();
            table.integer('idade_mae_nascimento').unsigned();
            table.boolean('sexo');
            table.boolean('linhagem_de_jesus');
            table.string('nome').notNullable();

            table.boolean('rei');
            table.boolean('profeta');
            table.boolean('sacerdote');
            table.boolean('juiz');

            table.integer('pai').unsigned();
            table.integer('mae').unsigned();
        }),
        knex.schema.table('ck_comments',table => {
            table.foreign('user_id').references('ck_users.id');
        }),
        knex.schema.table('ck_conjuges',table => {
            table.foreign('marido').references('ck_pessoas.id');
            table.foreign('mulher').references('ck_pessoas.id');
        }),
        knex.schema.table('ck_versions',table => {
            table.foreign('id_pessoa').references('ck_pessoas.id');
            table.foreign('user_id').references('ck_users.id');
        })
    ])
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('ck_comments');
};