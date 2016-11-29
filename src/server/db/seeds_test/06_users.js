
exports.seed = function(knex, Promise) {
    return knex('ck_users').insert([
        //{ id : 1, username : 'filiperoberto.s@gmail.com', password : '79ccc6075f73164047862c3fae41a223a60dff81', role : 'admin', created : null, modified : null, name : 'Filipe', website : '', description : '', picture: '', reputition : 0, email : 'filiperoberto.s@gmail.com'}
        { id : 1, username : 'filiperoberto.s@gmail.com', password : '1234', role : 'admin', created : null, modified : null, name : 'Filipe', website : '', description : '', picture: '', reputition : 0, email : 'filiperoberto.s@gmail.com'}
    ]);
}