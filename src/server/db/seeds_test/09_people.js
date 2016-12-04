exports.seed = function(knex, Promise) {
    return knex('ck_pessoas').insert([
        { id: 1, nome: '', last_version: 3 },
        { id: 2, nome: '', last_version: 2 },
        { id: 3, nome: '', last_version: 4 }
    ]);
}