
exports.up = function(knex, Promise) {
  return knex.schema.table('versoes',function(t) {
      t.index(['vrs_abbr'])
  })
};

exports.down = function(knex, Promise) {
    return knex.schema.table('versoes', function(t) {
        t.dropIndex([ 'vrs_abbr' ]);
    });
};
