
exports.up = function(knex, Promise) {

    const livros = [
        {liv_id: 1, liv_tes_id: 1, liv_posicao: 1, liv_nome : "Genesis", liv_abbr : "gn"},
        {liv_id: 2, liv_tes_id: 1, liv_posicao: 2, liv_nome : "Exodo", liv_abbr : "ex"},
        {liv_id: 3, liv_tes_id: 1, liv_posicao: 3, liv_nome : "Levitico", liv_abbr : "lv"},
        {liv_id: 4, liv_tes_id: 1, liv_posicao: 4, liv_nome : "Numeros", liv_abbr : "nm"},
        {liv_id: 5, liv_tes_id: 1, liv_posicao: 5, liv_nome : "Deuteronomios", liv_abbr : "dt"},
        {liv_id: 6, liv_tes_id: 1, liv_posicao: 6, liv_nome : "Josue", liv_abbr : "js"},
        {liv_id: 7, liv_tes_id: 1, liv_posicao: 7, liv_nome : "Juizes", liv_abbr : "jz"},
        {liv_id: 8, liv_tes_id: 1, liv_posicao: 8, liv_nome : "Rute", liv_abbr : "rt"},
        {liv_id: 9, liv_tes_id: 1, liv_posicao: 9, liv_nome : "I Samuel", liv_abbr : "1sm"},
        {liv_id: 10, liv_tes_id: 1, liv_posicao: 10, liv_nome : "II Samuel", liv_abbr : "2sm"},
        {liv_id: 11, liv_tes_id: 1, liv_posicao: 11, liv_nome : "I Reis", liv_abbr : "1rs"},
        {liv_id: 12, liv_tes_id: 1, liv_posicao: 12, liv_nome : "II Reis", liv_abbr : "2rs"},
        {liv_id: 13, liv_tes_id: 1, liv_posicao: 13, liv_nome : "I Cronicas", liv_abbr : "1cr"},
        {liv_id: 14, liv_tes_id: 1, liv_posicao: 14, liv_nome : "II Cronicas", liv_abbr : "2cr"},
        {liv_id: 15, liv_tes_id: 1, liv_posicao: 15, liv_nome : "Esdras", liv_abbr : "ed"},
        {liv_id: 16, liv_tes_id: 1, liv_posicao: 16, liv_nome : "Neemias", liv_abbr : "ne"},
        {liv_id: 17, liv_tes_id: 1, liv_posicao: 17, liv_nome : "Ester", liv_abbr : "et"},
        {liv_id: 18, liv_tes_id: 1, liv_posicao: 18, liv_nome : "Jo", liv_abbr : "jó"},
        {liv_id: 19, liv_tes_id: 1, liv_posicao: 19, liv_nome : "Salmos", liv_abbr : "sl"},
        {liv_id: 20, liv_tes_id: 1, liv_posicao: 20, liv_nome : "Proverbios", liv_abbr : "pv"},
        {liv_id: 21, liv_tes_id: 1, liv_posicao: 21, liv_nome : "Eclesiastes", liv_abbr : "ec"},
        {liv_id: 22, liv_tes_id: 1, liv_posicao: 22, liv_nome : "Cântico dos Cânticos", liv_abbr : "ct"},
        {liv_id: 23, liv_tes_id: 1, liv_posicao: 23, liv_nome : "Isaias", liv_abbr : "is"},
        {liv_id: 24, liv_tes_id: 1, liv_posicao: 24, liv_nome : "Jeremias", liv_abbr : "jr"},
        {liv_id: 25, liv_tes_id: 1, liv_posicao: 25, liv_nome : "Lamentacoes de Jeremias", liv_abbr : "lm"},
        {liv_id: 26, liv_tes_id: 1, liv_posicao: 26, liv_nome : "Ezequiel", liv_abbr : "ez"},
        {liv_id: 27, liv_tes_id: 1, liv_posicao: 27, liv_nome : "Daniel", liv_abbr : "dn"},
        {liv_id: 28, liv_tes_id: 1, liv_posicao: 28, liv_nome : "Oseias", liv_abbr : "os"},
        {liv_id: 29, liv_tes_id: 1, liv_posicao: 29, liv_nome : "Joel", liv_abbr : "jl"},
        {liv_id: 30, liv_tes_id: 1, liv_posicao: 30, liv_nome : "Amos", liv_abbr : "am"},
        {liv_id: 31, liv_tes_id: 1, liv_posicao: 31, liv_nome : "Obadias", liv_abbr : "ob"},
        {liv_id: 32, liv_tes_id: 1, liv_posicao: 32, liv_nome : "Jonas", liv_abbr : "jn"},
        {liv_id: 33, liv_tes_id: 1, liv_posicao: 33, liv_nome : "Miqueias", liv_abbr : "mq"},
        {liv_id: 34, liv_tes_id: 1, liv_posicao: 34, liv_nome : "Naum", liv_abbr : "na"},
        {liv_id: 35, liv_tes_id: 1, liv_posicao: 35, liv_nome : "Habacuque", liv_abbr : "hc"},
        {liv_id: 36, liv_tes_id: 1, liv_posicao: 36, liv_nome : "Sofonias", liv_abbr : "sf"},
        {liv_id: 37, liv_tes_id: 1, liv_posicao: 37, liv_nome : "Ageu", liv_abbr : "ag"},
        {liv_id: 38, liv_tes_id: 1, liv_posicao: 38, liv_nome : "Zacarias", liv_abbr : "zc"},
        {liv_id: 39, liv_tes_id: 1, liv_posicao: 39, liv_nome : "Malaquias", liv_abbr : "ml"},
        {liv_id: 40, liv_tes_id: 2, liv_posicao: 1, liv_nome : "Mateus", liv_abbr : "mt"},
        {liv_id: 41, liv_tes_id: 2, liv_posicao: 2, liv_nome : "Marcos", liv_abbr : "mc"},
        {liv_id: 42, liv_tes_id: 2, liv_posicao: 3, liv_nome : "Lucas", liv_abbr : "lc"},
        {liv_id: 43, liv_tes_id: 2, liv_posicao: 4, liv_nome : "Joao", liv_abbr : "jo"},
        {liv_id: 44, liv_tes_id: 2, liv_posicao: 5, liv_nome : "Atos", liv_abbr : "at"},
        {liv_id: 45, liv_tes_id: 2, liv_posicao: 6, liv_nome : "Romanos", liv_abbr : "rm"},
        {liv_id: 46, liv_tes_id: 2, liv_posicao: 7, liv_nome : "I Corintios", liv_abbr : "1co"},
        {liv_id: 47, liv_tes_id: 2, liv_posicao: 8, liv_nome : "II Corintios", liv_abbr : "2co"},
        {liv_id: 48, liv_tes_id: 2, liv_posicao: 9, liv_nome : "Galatas", liv_abbr : "gl"},
        {liv_id: 49, liv_tes_id: 2, liv_posicao: 10, liv_nome : "Efesios", liv_abbr : "ef"},
        {liv_id: 50, liv_tes_id: 2, liv_posicao: 11, liv_nome : "Filipenses", liv_abbr : "fp"},
        {liv_id: 51, liv_tes_id: 2, liv_posicao: 12, liv_nome : "Colossenses", liv_abbr : "cl"},
        {liv_id: 52, liv_tes_id: 2, liv_posicao: 13, liv_nome : "I Tessalonicenses ", liv_abbr : "1ts"},
        {liv_id: 53, liv_tes_id: 2, liv_posicao: 14, liv_nome : "II Tessalonicenses", liv_abbr : "2ts"},
        {liv_id: 54, liv_tes_id: 2, liv_posicao: 15, liv_nome : "I Timotoe", liv_abbr : "1tm"},
        {liv_id: 55, liv_tes_id: 2, liv_posicao: 16, liv_nome : "II Timotoe", liv_abbr : "2tm"},
        {liv_id: 56, liv_tes_id: 2, liv_posicao: 17, liv_nome : "Tito", liv_abbr : "tt"},
        {liv_id: 57, liv_tes_id: 2, liv_posicao: 18, liv_nome : "Filemom", liv_abbr : "fm"},
        {liv_id: 58, liv_tes_id: 2, liv_posicao: 19, liv_nome : "Hebreus", liv_abbr : "hb"},
        {liv_id: 59, liv_tes_id: 2, liv_posicao: 20, liv_nome : "Tiago", liv_abbr : "tg"},
        {liv_id: 60, liv_tes_id: 2, liv_posicao: 21, liv_nome : "I Pedro", liv_abbr : "1pe"},
        {liv_id: 61, liv_tes_id: 2, liv_posicao: 22, liv_nome : "II Pedro", liv_abbr : "2pe"},
        {liv_id: 62, liv_tes_id: 2, liv_posicao: 23, liv_nome : "I Joao", liv_abbr : "1jo"},
        {liv_id: 63, liv_tes_id: 2, liv_posicao: 24, liv_nome : "II Joao", liv_abbr : "2jo"},
        {liv_id: 64, liv_tes_id: 2, liv_posicao: 25, liv_nome : "III Joao", liv_abbr : "3jo"},
        {liv_id: 65, liv_tes_id: 2, liv_posicao: 26, liv_nome : "Judas", liv_abbr : "jd"},
        {liv_id: 66, liv_tes_id: 2, liv_posicao: 27, liv_nome : "Apocalipse", liv_abbr : "ap"}
      ];

      return knex.transaction((trx) => {

        return knex.schema.table('livros', table => table.string('liv_abbr')).transacting(trx)
        .then(() => {
            return Promise.all(
                livros.map((row) => {
                    return knex('livros')
                    .update({ liv_abbr : row.liv_abbr })
                    .where('liv_id',row.liv_id)
                    .transacting(trx);
                })
            )
        })
        .then(trx.commit)
        .catch(trx.rollback);
      })
  
};

exports.down = function(knex, Promise) {
    return knex.schema.table('livros', (table) => table.dropColumn('liv_abbr'));
};
