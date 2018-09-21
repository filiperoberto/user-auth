import * as Knex from 'knex';
const knex : Knex = require('../Connection');
import joinjs from 'join-js';
import { Filter } from '../../../util/filter';
import { VersionsFilter } from '../../../models/VersionsFilter';
import { Version } from '../../../models/Version';

const resultMaps = [
    {
        mapId: 'versionMap',
        idProperty: 'id',
        properties: ['id', 'version_number', 'citacoes', 'descricao', 'sinonimos', 'created', 'modified', 'aprovada', 'id_pessoa', 'idade_morte', 'idade_pai_nascimento', 'idade_mae_nascimento', 'sexo', 'linhagem_de_jesus', 'nome', 'rei', 'profeta', 'sacerdote', 'juiz', 'pai', 'mae', 'comments'],
        associations: [
            {name : 'user', mapId: 'userMap', columnPrefix: 'user_'},
            {name : 'father', mapId: 'associatedVersionMap', columnPrefix: 'pai_'},
            {name : 'mother', mapId: 'associatedVersionMap', columnPrefix: 'mae_'}
        ]
    },
    {
        mapId: 'userMap',
        idProperty: 'id',
        properties: ['id', 'name']
    },
    {
        mapId: 'associatedVersionMap',
        idProperty: 'id',
        properties: ['id', 'version_number', 'citacoes', 'descricao', 'sinonimos', 'created', 'modified', 'aprovada', 'id_pessoa', 'user_id', 'idade_morte', 'idade_pai_nascimento', 'idade_mae_nascimento', 'sexo', 'linhagem_de_jesus', 'nome', 'rei', 'profeta', 'sacerdote', 'juiz', 'pai', 'mae']
    },
]

export class VersionsRepository {

    private attributes: string[] = ['id', 'version_number', 'citacoes', 'descricao', 'sinonimos', 'created', 'modified', 'aprovada', 'id_pessoa', 'user_id', 'idade_morte', 'idade_pai_nascimento', 'idade_mae_nascimento', 'sexo', 'linhagem_de_jesus', 'nome', 'rei', 'profeta', 'sacerdote', 'juiz', 'pai', 'mae'];

    public getAll(filter: VersionsFilter) {
        let query = this.fullQuery()

        this.applyFilters(filter, query);
        
        query.limit(filter.limit).offset(filter.offset);
        
        filter.orderBy.forEach(order => {

            if(order.orderBy === 'id') {
                order.orderBy = 'pessoa.id';
            }
            query.orderBy(order.orderBy, order.direction)
        });

        return query.then(resultSet => {
            return joinjs.map(resultSet, resultMaps, 'versionMap','pessoa_');
        });
    }

    private applyFilters(filter: VersionsFilter, query: Knex.QueryBuilder) {
        if (filter.person) {
            query.where('pessoa.id_pessoa', filter.person);
        }
        if (filter.user && !filter.admin) {
            query.where('pessoa.user_id', filter.user);
        }
    }

    public getLastVersion(person : number) {
        return knex('ck_versions').select().where('id_pessoa',person).orderBy('id','desc').limit(1);
    }

    public create(version : Version) {
        delete version.id;
        delete version.modified;
        version.created = knex.fn.now() as any;
        return knex('ck_versions').insert([version]);
    }

    public getById(id : number) {

        return this.fullQuery()
            .where('pessoa.id',id)
            .then(resultSet => {
                return joinjs.map(resultSet, resultMaps, 'versionMap','pessoa_');
            });
    }

    public count(filter: VersionsFilter) {
        let query = knex.count('id as count').from('ck_versions as pessoa');

        this.applyFilters(filter, query);

        return query;
    }

    private fullQuery() {
        let selectedAttributes = this.getAttributes('pessoa');
        selectedAttributes = selectedAttributes.concat(this.getAttributes('pai'));
        selectedAttributes = selectedAttributes.concat(this.getAttributes('mae'));
        selectedAttributes.push('ck_users.name as user_name');
        selectedAttributes.push('ck_users.id as user_id');
        selectedAttributes.push('comments as pessoa_comments');

        return knex.select(selectedAttributes)
            .from('ck_versions as pessoa')
            .innerJoin('ck_users','ck_users.id','pessoa.user_id')
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
                knex('ck_comments')
                    .select('ck_comments.version_id',knex.raw('count(ck_comments.id) as comments'))
                    .groupBy('ck_comments.version_id')
                    .as('comments')
                    ,'pessoa.id',
                    'comments.version_id'
            )
    }

    public edit(id : string, version: Version) {
        version.modified = knex.fn.now() as any;
        return knex('ck_versions').update(version).where('id',id);
    }

    private getAttributes(prefix: string): string[] {
        let clone = this.attributes.slice(0);
        return clone.map(attr => `${prefix}.${attr} as ${prefix}_${attr}`);
    }

}