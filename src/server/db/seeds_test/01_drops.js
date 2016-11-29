
exports.seed = function(knex, Promise) {
    return knex('versiculos').del().then(() => {
        return knex('livros').del().then(() => {
            return Promise.all([
                knex('testamentos').del(),
                knex('versoes').del(),
                knex('ck_users').del()
            ])
        })
    })
};
