
exports.seed = function(knex, Promise) {
    return knex('ck_pessoas').insert([
        { id : 1 , nome : ''},
        { id : 2 , nome : ''}
    ]);
}