
exports.seed = function(knex, Promise) {
    return Promise.all([
        knex('versiculos').del(),
        knex('livros').del(),
        knex('testamentos').del(),
        knex('versoes').del()
    ])
};
