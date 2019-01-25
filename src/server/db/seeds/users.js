exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
    return knex('users').del()
        .then(function() {
            // Inserts seed entries
            return knex('users').insert([
                { id: 1, username: 'example@example.com', password: '0aee08b69285710fcda2ec80cf83eb816ae74ba7' /* 1234 */, role: 'admin', created: null, modified: null, name: 'Example', website: '', description: '', picture: '', reputation: 0, email: 'example@example.com' }
            ]);
        });
};