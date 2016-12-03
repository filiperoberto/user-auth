
exports.seed = function(knex, Promise) {
    return knex('ck_pessoas').del()
    /*return Promise.all([
        knex('ck_conjuges').del(),
        knex('ck_versions').del()
    ]).then(() => knex('ck_pessoas').del())*/
};
