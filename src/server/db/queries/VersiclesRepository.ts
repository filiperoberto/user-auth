import * as Knex from 'knex';
import { VersiclesFilter } from '../../../models/VersiclesFilter';
const knex : Knex = require('../Connection');

export class VersiclesRepository {

    public getByVersion(filter : VersiclesFilter) {
        let query = knex.select('versiculos.*')
            .from('versiculos')
            .innerJoin('versoes','versiculos.ver_vrs_id','versoes.vrs_id')
            .innerJoin('livros','versiculos.ver_liv_id','livros.liv_id')
            .where('versoes.vrs_abbr',filter.versao);

        if(filter.livro) {
            query.andWhere('livros.liv_abbr', filter.livro);
        }

        if(filter.capitulo) {
            query.andWhere('versiculos.ver_capitulo', filter.capitulo)
        }

        if(filter.versiculo) {
            query.andWhere('versiculos.ver_versiculo', filter.versiculo)
        }

        if(filter.versiculos) {
            query.whereBetween('versiculos.ver_versiculo', filter.versiculos)
        }

        if(!(filter.capitulo && !filter.versiculo && !filter.versiculos)) {
            query.limit(filter.limit).offset(filter.offset);
        }
        
        filter.orderBy.forEach(order => {

            if(order.orderBy === 'id') {
                order.orderBy = 'ver_id';
            }

            query.orderBy(order.orderBy, order.direction)
        })

        return query;
    }

    public count(filter : VersiclesFilter) {
        let query = knex.count('versiculos.ver_id as count')
            .from('versiculos')
            .innerJoin('versoes','versiculos.ver_vrs_id','versoes.vrs_id')
            .innerJoin('livros','versiculos.ver_liv_id','livros.liv_id')
            .where('versoes.vrs_abbr',filter.versao);

        if(filter.livro) {
            query.andWhere('livros.liv_abbr', filter.livro);
        }

        if(filter.capitulo) {
            query.andWhere('versiculos.ver_capitulo', filter.capitulo)
        }

        if(filter.versiculos) {
            query.whereBetween('versiculos.ver_versiculo', filter.versiculos)
        }

        if(filter.versiculo) {
            query.andWhere('versiculos.ver_versiculo', filter.versiculo)
        }

        return query;
    }

}