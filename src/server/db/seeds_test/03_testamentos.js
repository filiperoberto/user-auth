
exports.seed = function(knex, Promise) {
  return Promise.all([ 
    knex('testamentos').insert({tes_id: 1, tes_nome: 'Antigo'}),
    knex('testamentos').insert({tes_id: 2, tes_nome: 'Novo'})
  ]);
}