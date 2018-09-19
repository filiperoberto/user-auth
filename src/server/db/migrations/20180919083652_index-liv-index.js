
exports.up = function(knex, Promise) {
    return knex.schema.table('livros',function(t) {
        t.index(['liv_abbr'])
    })
  };
  
  exports.down = function(knex, Promise) {
      return knex.schema.table('livros', function(t) {
          t.dropIndex([ 'liv_abbr' ]);
      });
  };
  