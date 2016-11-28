
exports.seed = function(knex, Promise) {
  return Promise.all([ 
    knex('versoes').insert({vrs_id: 1, vrs_nome: 'ARA', vrs_abbr : 'ara'}),
    knex('versoes').insert({vrs_id: 2, vrs_nome: 'NVI', vrs_abbr : 'nvi'})
  ]);
}