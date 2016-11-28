import * as Knex from 'knex';
const knex : Knex = require('../Connection');

export class VersiclesRepository {

    private knex : Knex;

    contructor() {
        this.knex = knex;
    }

    public getByVersion(version : string) {
        return knex.select('versiculos.*')
            .from('versiculos')
            .innerJoin('versoes','versiculos.ver_vrs_id','versoes.vrs_id')
            .where('versoes.vrs_abbr',version)
            .orderBy('ver_id','asc')
    }

    public getByVersionAndBook(version : string, book : string) {
        return knex.select('versiculos.*')
            .from('versiculos')
            .innerJoin('versoes','versiculos.ver_vrs_id','versoes.vrs_id')
            .innerJoin('livros','versiculos.ver_liv_id','livros.liv_id')
            .where('versoes.vrs_abbr', version)
            .where('livros.liv_abbr', book)
            .orderBy('ver_id','asc')
    }

}