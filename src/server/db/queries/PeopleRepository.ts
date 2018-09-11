import * as Knex from 'knex';
const knex: Knex = require('../Connection');
import joinjs from 'join-js';

const resultMaps = [
    { 
        mapId: 'personMap',
        idProperty: 'id',
        collections: [
            {name : 'version', mapId: 'versionMap', columnPrefix: 'ck_versions_'}
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

    /*public getAll() {
        let query = this.getPersonQuery(); 
        return knex.raw(query)
    }*/

    public getById(id: string) {

        let selectedAttributes = this.getAttributes('ck_versions');
        selectedAttributes = selectedAttributes.concat(this.getAttributes('pai'));
        selectedAttributes.push('ck_pessoas.id')

        return knex('ck_pessoas')
            .select(selectedAttributes)
            .innerJoin('ck_versions','ck_versions.id_pessoa','ck_pessoas.id')
            .leftOuterJoin(
                knex('ck_versions as p')
                .select()
                .whereIn('p.id',function() {
                    this.max('ck_versions.id')
                    .from('ck_versions')
                    .where('ck_versions.id_pessoa','p.id')
                    .andWhere('ck_versions.aprovada',1)
                })
                .as('pai')
                ,'ck_versions.pai','pai.id')
            .whereIn('ck_versions.id',function() {
                this.max('ck_versions.id')
                .from('ck_versions')
                .where('ck_versions.id_pessoa',id)
                .andWhere('ck_versions.aprovada',1)
            })
            .where('ck_pessoas.id',id)/*.then(resultSet => {
                return joinjs.map(resultSet, resultMaps, 'personMap');
            });*/
    }

    /*private getPersonQuery(): string {

        let versionAttributes = this.getAttributes('v');
        let paiAttributes = this.getAttributes('pai');
        let maeAttributes = this.getAttributes('mae');

        return `SELECT ${versionAttributes.join(',')}, ${paiAttributes.join(',')}, ${maeAttributes.join(',')}
            FROM ck_pessoas pe
                        INNER jOIN  ck_versions v
                        ON v.id = pe.last_version
                        LEFT OUTER JOIN (
                            SELECT pv.*
                            FROM ck_pessoas ppe
                            INNER jOIN  ck_versions pv
                            ON pv.id = ppe.last_version
                            WHERE pv.aprovada = 1
                        ) AS pai
                        ON pai.id_pessoa = v.pai
                        LEFT OUTER JOIN (
                            SELECT mv.*
                            FROM ck_pessoas mpe
                            INNER jOIN  ck_versions mv
                            ON mv.id = mpe.last_version
                            WHERE mv.aprovada = 1
                        ) AS mae
                        ON mae.id_pessoa = v.mae
                        WHERE v.aprovada = 1`
    }*/

    private getAttributes(prefix: string): string[] {
        let clone = this.attributes.slice(0);
        return clone.map(attr => `${prefix}.${attr} as ${prefix}_${attr}`);
    }
}