import * as Knex from 'knex';
import { VersiclesFilter } from '../../../models/VersiclesFilter';
const knex: Knex = require('../Connection');

export class VersiclesRepository {

    public getByVersion(filter: VersiclesFilter) {

        let query = knex.select('versiculos.ver_id as id', 'versiculos.ver_texto as texto', 'versiculos.ver_capitulo as capitulo', 'versiculos.ver_versiculo as versiculo', 'versoes.vrs_abbr as versao', 'livros.liv_abbr')
            .from('versiculos')
            .innerJoin('versoes', 'versiculos.ver_vrs_id', 'versoes.vrs_id')
            .innerJoin('livros', 'versiculos.ver_liv_id', 'livros.liv_id')
            .where('versoes.vrs_abbr', filter.versao);

        if (filter.livro) {
            query.andWhere('livros.liv_abbr', filter.livro);
        }

        if (filter.capitulo) {
            query.andWhere('versiculos.ver_capitulo', filter.capitulo)
        }

        if (filter.versiculo) {
            query.andWhere('versiculos.ver_versiculo', filter.versiculo)
        }

        if (filter.versiculos) {
            query.whereBetween('versiculos.ver_versiculo', filter.versiculos)
        }

        if (!(filter.capitulo && !filter.versiculo && !filter.versiculos)) {
            query.limit(filter.limit).offset(filter.offset);
        }

        filter.orderBy.forEach(order => {

            if (order.orderBy === 'id') {
                order.orderBy = 'ver_id';
            }

            query.orderBy(order.orderBy, order.direction)
        })

        return query;
    }

    public count(filter: VersiclesFilter) {
        let query = knex.count('versiculos.ver_id as count')
            .from('versiculos')
            .innerJoin('versoes', 'versiculos.ver_vrs_id', 'versoes.vrs_id')
            .innerJoin('livros', 'versiculos.ver_liv_id', 'livros.liv_id')
            .where('versoes.vrs_abbr', filter.versao);

        if (filter.livro) {
            query.andWhere('livros.liv_abbr', filter.livro);
        }

        if (filter.capitulo) {
            query.andWhere('versiculos.ver_capitulo', filter.capitulo)
        }

        if (filter.versiculos) {
            query.whereBetween('versiculos.ver_versiculo', filter.versiculos)
        }

        if (filter.versiculo) {
            query.andWhere('versiculos.ver_versiculo', filter.versiculo)
        }

        return query;
    }

    public listBooks() {
        return knex.select('liv_abbr as abbr', 'liv_nome as nome').from('livros');
    }

    public listChapters(filter: VersiclesFilter) {
        return knex.select('ver_capitulo as chapter')
            .from('versiculos')
            .innerJoin('versoes', 'versiculos.ver_vrs_id', 'versoes.vrs_id')
            .innerJoin('livros', 'versiculos.ver_liv_id', 'livros.liv_id')
            .where('versoes.vrs_abbr', filter.versao)
            .andWhere('livros.liv_abbr', filter.livro)
            .groupBy('ver_capitulo')
            .orderBy('ver_capitulo', 'asc');
    }

    public listVersicles(filter: VersiclesFilter) {
        return knex.select('ver_versiculo as versiculo')
            .from('versiculos')
            .innerJoin('versoes', 'versiculos.ver_vrs_id', 'versoes.vrs_id')
            .innerJoin('livros', 'versiculos.ver_liv_id', 'livros.liv_id')
            .where('versoes.vrs_abbr', filter.versao)
            .andWhere('livros.liv_abbr', filter.livro)
            .andWhere('versiculos.ver_capitulo', filter.capitulo)
            .orderBy('ver_versiculo', 'asc');
    }

    public nextBook(filter: VersiclesFilter) {
        return knex.select('livros.liv_abbr')
            .from('livros')
            .whereIn('liv_id', function () {
                this.select(knex.raw('liv_id + 1'))
                    .from('livros')
                    .where('liv_abbr', filter.livro)
            })
    }

    public prevBook(filter: VersiclesFilter) {
        return knex.select('livros.liv_abbr')
            .from('livros')
            .whereIn('liv_id', function () {
                this.select(knex.raw('liv_id - 1'))
                    .from('livros')
                    .where('liv_abbr', filter.livro)
            })
    }

    public nextChapter(filter: VersiclesFilter) {
        return knex.select('ver_capitulo', 'liv_abbr')
            .from('versiculos')
            .innerJoin('versoes', 'versiculos.ver_vrs_id', 'versoes.vrs_id')
            .innerJoin('livros', 'versiculos.ver_liv_id', 'livros.liv_id')
            .whereIn('ver_id', function () {
                this.select(knex.raw('max(ver_id) + 1'))
                    .from('versiculos')
                    .innerJoin('versoes', 'versiculos.ver_vrs_id', 'versoes.vrs_id')
                    .innerJoin('livros', 'versiculos.ver_liv_id', 'livros.liv_id')
                    .where('vrs_abbr', filter.versao)
                    .andWhere('liv_abbr', filter.livro)
                    .andWhere('ver_capitulo', filter.capitulo)
            })
            .andWhere('vrs_abbr', filter.versao);
    }

    public prevChapter(filter: VersiclesFilter) {
        return knex.select('ver_capitulo', 'liv_abbr')
            .from('versiculos')
            .innerJoin('versoes', 'versiculos.ver_vrs_id', 'versoes.vrs_id')
            .innerJoin('livros', 'versiculos.ver_liv_id', 'livros.liv_id')
            .whereIn('ver_id', function () {
                this.select(knex.raw('min(ver_id) - 1'))
                    .from('versiculos')
                    .innerJoin('versoes', 'versiculos.ver_vrs_id', 'versoes.vrs_id')
                    .innerJoin('livros', 'versiculos.ver_liv_id', 'livros.liv_id')
                    .where('vrs_abbr', filter.versao)
                    .andWhere('liv_abbr', filter.livro)
                    .andWhere('ver_capitulo', filter.capitulo)
            })
            .andWhere('vrs_abbr', filter.versao);
    }

}