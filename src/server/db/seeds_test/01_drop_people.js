
exports.seed = function(knex, Promise) {
    return knex('ck_conjuges').del().then(()=>{

        return knex('ck_versions').del().then(() => {
            return Promise.all([
                knex('ck_pessoas').del(),
                knex('ck_users').del()
            ])
        })

    })
};
