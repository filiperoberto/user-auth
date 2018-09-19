exports.up = function(knex, Promise) {

    const livros = [
        {vrs_id: 1, vrs_abbr : "arip"},
        {vrs_id: 2, vrs_abbr : "arc"},
        {vrs_id: 3, vrs_abbr : "nvi"},
        {vrs_id: 4, vrs_abbr : "sbb"},
        {vrs_id: 5, vrs_abbr : "ara"},
        {vrs_id: 6, vrs_abbr : "un"}
      ];

      return knex.transaction((trx) => {

        return knex.schema.table('versoes', table => table.string('vrs_abbr')).transacting(trx)
        .then(() => {
            return Promise.all(
                livros.map((row) => {
                    return knex('versoes')
                    .update({ vrs_abbr : row.vrs_abbr })
                    .where('vrs_id',row.vrs_id)
                    .transacting(trx);
                })
            )
        })
        .then(trx.commit)
        .catch(trx.rollback);
      })
  
};

exports.down = function(knex, Promise) {
    return knex.schema.table('versoes', (table) => table.dropColumn('vrs_abbr'));
};