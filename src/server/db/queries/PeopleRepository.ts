import * as Knex from 'knex';
const knex: Knex = require('../Connection');
import joinjs from 'join-js';
import { PeopleFilter } from '../../../models/PeopleFilter';

const resultMaps = [
    { 
        mapId: 'personMap',
        idProperty: 'id',
        associations: [
            {name : 'version', mapId: 'versionMap', columnPrefix: 'pessoa_'},
            {name : 'pai', mapId: 'versionMap', columnPrefix: 'pai_'},
            {name : 'mae', mapId: 'versionMap', columnPrefix: 'mae_'},
        ],
        collections : [
            {name : 'filhos', mapId: 'versionMap', columnPrefix: 'filho_'},
            {name : 'conjuges', mapId: 'versionMap', columnPrefix: 'conjuge_'}
        ]
    },
    {
        mapId: 'versionMap',
        idProperty: 'id',
        properties: ['id', 'version_number', 'citacoes', 'descricao', 'sinonimos', 'created', 'modified', 'aprovada', 'id_pessoa', 'user_id', 'idade_morte', 'idade_pai_nascimento', 'idade_mae_nascimento', 'sexo', 'linhagem_de_jesus', 'nome', 'rei', 'profeta', 'sacerdote', 'juiz', 'pai', 'mae']
    }
]

export class PeopleRepository {

    private attributes: string[] = ['id', 'version_number', 'citacoes', 'descricao', 'sinonimos', 'created', 'modified', 'aprovada', 'id_pessoa', 'user_id', 'idade_morte', 'idade_pai_nascimento', 'idade_mae_nascimento', 'sexo', 'linhagem_de_jesus', 'nome', 'rei', 'profeta', 'sacerdote', 'juiz', 'pai', 'mae'];

    public getAll(filter: PeopleFilter) {
        return this.fullQuery()
            .whereIn('ck_pessoas.id',function() {

                this.select('pessoa_id as id').from(function () {

                    let q = this.select('ck_pessoas.id as pessoa_id','pessoa.*').from('ck_pessoas')
                        .leftOuterJoin(
                            knex('ck_versions as p')
                                .select('p.*')
                                .innerJoin(
                                    knex('ck_versions as ppp')
                                        .select(knex.raw('max(ppp.id) as ppp_id'), 'ppp.id_pessoa')
                                        .where('ppp.aprovada', 1)
                                        .groupBy('ppp.id_pessoa')
                                        .as('ppp')
                                    , 'p.id'
                                    , 'ppp_id'
                                )
                                .as('pessoa')
                            , 'ck_pessoas.id', 'pessoa.id_pessoa')
    
                    if(filter.name) {
                        q.where('pessoa.nome','like',`%${filter.name}%`).orWhere('pessoa.sinonimos','like',`%${filter.name}%`)
                    }
    
                    filter.orderBy.forEach(order => {
                        q.orderBy(order.orderBy, order.direction);
                    })
    
                    q.groupBy('ck_pessoas.id').limit(filter.limit).offset(filter.offset);
    
                    q.as('o');
                })

            }).then(resultSet => {
                return joinjs.map(resultSet, resultMaps, 'personMap');
            });
    }

    public count(filter: PeopleFilter) {
        return knex.count('pessoa_id as count').from(function () {

            let q = this.select('ck_pessoas.id as pessoa_id','pessoa.*').from('ck_pessoas')
                .leftOuterJoin(
                    knex('ck_versions as p')
                        .select('p.*')
                        .innerJoin(
                            knex('ck_versions as ppp')
                                .select(knex.raw('max(ppp.id) as ppp_id'), 'ppp.id_pessoa')
                                .where('ppp.aprovada', 1)
                                .groupBy('ppp.id_pessoa')
                                .as('ppp')
                            , 'p.id'
                            , 'ppp_id'
                        )
                        .as('pessoa')
                    , 'ck_pessoas.id', 'pessoa.id_pessoa')

            if(filter.name) {
                q.where('pessoa.nome','like',`%${filter.name}%`).orWhere('pessoa.sinonimos','like',`%${filter.name}%`)
            }

            q.groupBy('ck_pessoas.id');

            q.as('o');
        })
    }

    public getById(id: string) {

        return this.fullQuery()
            .where('ck_pessoas.id',id).then(resultSet => {
                return joinjs.map(resultSet, resultMaps, 'personMap');
            });
    }

    private fullQuery() {
        let selectedAttributes = this.getAttributes('pessoa');
        selectedAttributes = selectedAttributes.concat(this.getAttributes('pai'));
        selectedAttributes = selectedAttributes.concat(this.getAttributes('mae'));
        selectedAttributes = selectedAttributes.concat(this.getAttributes('filho'));
        selectedAttributes = selectedAttributes.concat(this.getAttributes('conjuge'));
        selectedAttributes.push('ck_pessoas.id')

        return knex('ck_pessoas')
            .select(selectedAttributes)
            .leftOuterJoin(
                knex('ck_versions as p')
                    .select('p.*')
                    .innerJoin(
                        knex('ck_versions as ppp')
                            .select(knex.raw('max(ppp.id) as ppp_id'), 'ppp.id_pessoa')
                            .where('ppp.aprovada', 1)
                            .groupBy('ppp.id_pessoa')
                            .as('ppp')
                        , 'p.id'
                        , 'ppp_id'
                    )
                    .as('pessoa')
                , 'ck_pessoas.id', 'pessoa.id_pessoa')
            .leftOuterJoin(
                knex('ck_versions as p')
                    .select('p.*')
                    .innerJoin(
                        knex('ck_versions as ppp')
                            .select(knex.raw('max(ppp.id) as ppp_id'), 'ppp.id_pessoa')
                            .where('ppp.aprovada', 1)
                            .groupBy('ppp.id_pessoa')
                            .as('ppp')
                        , 'p.id'
                        , 'ppp_id'
                    )
                    .as('pai')
                , 'pessoa.pai', 'pai.id_pessoa')
            .leftOuterJoin(
                knex('ck_versions as p')
                    .select('p.*')
                    .innerJoin(
                        knex('ck_versions as ppp')
                            .select(knex.raw('max(ppp.id) as ppp_id'), 'ppp.id_pessoa')
                            .where('ppp.aprovada', 1)
                            .groupBy('ppp.id_pessoa')
                            .as('ppp')
                        , 'p.id'
                        , 'ppp_id'
                    )
                    .as('mae')
                , 'pessoa.mae', 'mae.id_pessoa')
            .leftOuterJoin(
                knex('ck_versions as p')
                    .select('p.*')
                    .innerJoin(
                        knex('ck_versions as ppp')
                            .select(knex.raw('max(ppp.id) as ppp_id'), 'ppp.id_pessoa')
                            .where('ppp.aprovada', 1)
                            .groupBy('ppp.id_pessoa')
                            .as('ppp')
                        , 'p.id'
                        , 'ppp_id'
                    )
                    .as('filho')
                , knex.raw('pessoa.id_pessoa = filho.mae or pessoa.id_pessoa = filho.pai')
            )
            .leftOuterJoin('ck_conjuges', function () {
                this.on('ck_conjuges.marido', 'pessoa.id_pessoa').orOn('ck_conjuges.mulher', 'pessoa.id_pessoa')
            })
            .leftOuterJoin(
                knex('ck_versions as p')
                    .select('p.*')
                    .innerJoin(
                        knex('ck_versions as ppp')
                            .select(knex.raw('max(ppp.id) as ppp_id'), 'ppp.id_pessoa')
                            .where('ppp.aprovada', 1)
                            .groupBy('ppp.id_pessoa')
                            .as('ppp')
                        , 'p.id'
                        , 'ppp_id'
                    )
                    .as('conjuge')
                , knex.raw('(ck_conjuges.marido = conjuge.id_pessoa and pessoa.id_pessoa = ck_conjuges.mulher) or (ck_conjuges.mulher = conjuge.id_pessoa and pessoa.id_pessoa = ck_conjuges.marido)')
            )
    }

    private getAttributes(prefix: string): string[] {
        let clone = this.attributes.slice(0);
        return clone.map(attr => `${prefix}.${attr} as ${prefix}_${attr}`);
    }
}