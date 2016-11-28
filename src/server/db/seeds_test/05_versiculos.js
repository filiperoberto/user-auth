
exports.seed = function(knex, Promise) {
    return knex('versiculos').insert([
        { ver_id : 1, ver_vrs_id : 1, ver_liv_id : 1, ver_capitulo : 1, ver_versiculo : 1, ver_texto : "No princípio criou Deus os céus e a terra."},
        { ver_id : 2, ver_vrs_id : 1, ver_liv_id : 1, ver_capitulo : 1, ver_versiculo : 2, ver_texto : "A terra era sem forma e vazia; e havia trevas sobre a face do abismo, mas o Espírito de Deus pairava sobre a face das águas."},
        { ver_id : 4, ver_vrs_id : 1, ver_liv_id : 1, ver_capitulo : 1, ver_versiculo : 3, ver_texto : "Disse Deus: haja luz. E houve luz."},
        { ver_id : 5, ver_vrs_id : 1, ver_liv_id : 1, ver_capitulo : 2, ver_versiculo : 1, ver_texto : "Foi-se um homem da casa de Levi e casou com uma filha de Levi."},
        { ver_id : 6, ver_vrs_id : 1, ver_liv_id : 2, ver_capitulo : 1, ver_versiculo : 1, ver_texto : "Ora, estes são os nomes dos filhos de Israel, que entraram no Egito; entraram com Jacó, cada um com a sua família:"},
        { ver_id : 7, ver_vrs_id : 2, ver_liv_id : 1, ver_capitulo : 1, ver_versiculo : 1, ver_texto : "No princípio Deus criou os céus e a terra."},
        { ver_id : 8, ver_vrs_id : 2, ver_liv_id : 1, ver_capitulo : 1, ver_versiculo : 2, ver_texto : "Era a terra sem forma e vazia; trevas cobriam a face do abismo, e o Espírito de Deus se movia sobre a face das águas."},
        { ver_id : 9, ver_vrs_id : 2, ver_liv_id : 1, ver_capitulo : 1, ver_versiculo : 3, ver_texto : "Disse Deus: 'Haja luz', e houve luz."}
    ]);
}