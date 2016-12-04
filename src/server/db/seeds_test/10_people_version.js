exports.seed = function(knex, Promise) {
    return knex('ck_versions').insert([
        { id: 1, nome: "Adão", version_number: 1, sexo: 1, citacoes: 'gn 1', descricao: 'aa', sinonimos: '', aprovada: 1, id_pessoa: 1, user_id: 1, idade_morte: 90 },
        { id: 2, nome: "Eva", version_number: 1, sexo: 0, citacoes: 'gn 1', descricao: 'aa', sinonimos: '', aprovada: 1, id_pessoa: 2, user_id: 1, idade_morte: 90 },
        { id: 3, nome: "Adãoo", version_number: 2, sexo: 1, citacoes: 'gn 1', descricao: 'aa', sinonimos: '', aprovada: 1, id_pessoa: 1, user_id: 1, idade_morte: 90 },
        { id: 4, nome: "Sete", version_number: 1, sexo: 1, citacoes: 'gn 3', descricao: 'aa', sinonimos: '', aprovada: 1, id_pessoa: 3, user_id: 1, idade_morte: 90, pai: 1, mae: 2 }
    ]);
}