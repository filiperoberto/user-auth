
exports.seed = function(knex, Promise) {
  return knex('versoes').del()
    .then(function () {
      return Promise.all([
        knex('versoes').insert({vrs_id: 1, vrs_nome: 'ARA'}),
        knex('versoes').insert({vrs_id: 2, vrs_nome: 'NVI'})
      ]);
    });
};
