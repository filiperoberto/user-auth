import * as Knex from 'knex';
const knex: Knex = require('../Connection');
import joinjs from 'join-js';

const resultMaps = [
    { 
        mapId: 'personMap',
        idProperty: 'id',
        associations: [
            {name : 'version', mapId: 'versionMap', columnPrefix: 'ck_versions_'},
            {name : 'pai', mapId: 'versionMap', columnPrefix: 'pai_'},
            {name : 'mae', mapId: 'versionMap', columnPrefix: 'mae_'},
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

    public getById(id: string) {

        let selectedAttributes = this.getAttributes('ck_versions');
        selectedAttributes = selectedAttributes.concat(this.getAttributes('pai'));
        selectedAttributes = selectedAttributes.concat(this.getAttributes('mae'));
        selectedAttributes.push('ck_pessoas.id')

        return knex('ck_pessoas')
            .select(selectedAttributes)
            .innerJoin('ck_versions','ck_versions.id_pessoa','ck_pessoas.id')
            .leftOuterJoin(
                knex('ck_versions as p')
                .select('p.*')
                .innerJoin(
                    knex('ck_versions as ppp')
                        .select(knex.raw('max(ppp.id) as ppp_id'),'ppp.id_pessoa')
                        .where('ppp.aprovada',1)
                        .groupBy('ppp.id_pessoa')
                        .as('ppp')
                    ,'p.id'
                    ,'ppp_id'
                )
                .as('pai')
                ,'ck_versions.pai','pai.id_pessoa')
            .leftOuterJoin(
                knex('ck_versions as p')
                .select('p.*')
                .innerJoin(
                    knex('ck_versions as ppp')
                        .select(knex.raw('max(ppp.id) as ppp_id'),'ppp.id_pessoa')
                        .where('ppp.aprovada',1)
                        .groupBy('ppp.id_pessoa')
                        .as('ppp')
                    ,'p.id'
                    ,'ppp_id'
                )
                .as('mae')
                ,'ck_versions.mae','mae.id_pessoa')
            .whereIn('ck_versions.id',function() {
                this.max('ck_versions.id')
                .from('ck_versions')
                .where('ck_versions.id_pessoa',id)
                .andWhere('ck_versions.aprovada',1)
            })
            .where('ck_pessoas.id',id).then(resultSet => {
                return joinjs.map(resultSet, resultMaps, 'personMap');
            });
    }

    private getAttributes(prefix: string): string[] {
        let clone = this.attributes.slice(0);
        return clone.map(attr => `${prefix}.${attr} as ${prefix}_${attr}`);
    }
}