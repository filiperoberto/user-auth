
exports.seed = function(knex, Promise) {
    return knex('ck_users').insert([
        { id : 1, username : 'filiperoberto.s@gmail.com', password : '0aee08b69285710fcda2ec80cf83eb816ae74ba7', role : 'admin', created : null, modified : null, name : 'Filipe', website : '', description : '', picture: '', reputition : 0, email : 'filiperoberto.s@gmail.com'}
    ]);
}