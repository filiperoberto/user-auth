
exports.seed = function(knex, Promise) {
    return knex('ck_tags').insert([
        { id : 1, classe : 'primary', texto : 'Cadastro'},
        { id : 2, classe : 'primary', texto : 'Dica'}
    ]);
}