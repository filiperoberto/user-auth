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

    public getByVersionAndBookAndChapter(version : string, book : string, chapter : string) {
        return knex.select('versiculos.*')
            .from('versiculos')
            .innerJoin('versoes','versiculos.ver_vrs_id','versoes.vrs_id')
            .innerJoin('livros','versiculos.ver_liv_id','livros.liv_id')
            .where('versoes.vrs_abbr', version)
            .andWhere('livros.liv_abbr', book)
            .andWhere('versiculos.ver_capitulo', chapter)
            .orderBy('ver_id','asc') 
    }

    public getByVersionAndBookAndChapterAndVersicle(version : string, book : string, chapter : string, versicle : string) {
        return knex.select('versiculos.*')
            .from('versiculos')
            .innerJoin('versoes','versiculos.ver_vrs_id','versoes.vrs_id')
            .innerJoin('livros','versiculos.ver_liv_id','livros.liv_id')
            .where('versoes.vrs_abbr', version)
            .andWhere('livros.liv_abbr', book)
            .andWhere('versiculos.ver_capitulo', chapter)
            .andWhere('versiculos.ver_versiculo', versicle)
            .orderBy('ver_id','asc') 
    }

    public getByVersionAndBookAndChapterAndVersicles(version : string, book : string, chapter : string, versicles : [number, number]) {
        return knex.select('versiculos.*')
            .from('versiculos')
            .innerJoin('versoes','versiculos.ver_vrs_id','versoes.vrs_id')
            .innerJoin('livros','versiculos.ver_liv_id','livros.liv_id')
            .where('versoes.vrs_abbr', version)
            .andWhere('livros.liv_abbr', book)
            .andWhere('versiculos.ver_capitulo', chapter)
            .whereBetween('versiculos.ver_versiculo', versicles)
            .orderBy('ver_id','asc') 
    }



}