import * as Knex from 'knex';
const knex : Knex = require('../Connection');

export class PeopleRepository {

    public getAll() {
        return knex.select('ck_versions.*').from('ck_pessoas')
            .innerJoin('ck_versions', 'ck_versions.id', 'ck_pessoas.last_version')
            .where('ck_versions.aprovada',1);
    }

    public getById(id : string) {
        return knex.select('ck_versions.*').from('ck_pessoas')
            .innerJoin('ck_versions', 'ck_versions.id', 'ck_pessoas.last_version')
            .joinRaw(
                knex.select('ck_versions.*').from('ck_pessoas')
                .innerJoin('ck_versions', 'ck_versions.id', 'ck_pessoas.last_version')
                .where('ck_versions.aprovada',1).toString()
            )
            .where('ck_versions.aprovada',1)
            .andWhere('ck_pessoas.id',id);
    }

    /*
    SELECT v.*, pai.*
FROM ck_pessoas pe
INNER jOIN  ck_versions v
ON v.id = pe.last_version
JOIN (
	SELECT pv.*
	FROM ck_pessoas ppe
	INNER jOIN  ck_versions pv
	ON pv.id = ppe.last_version
	WHERE pv.aprovada = 1
) AS pai
ON pai.id_pessoa = v.pai
JOIN (
	SELECT mv.*
	FROM ck_pessoas mpe
	INNER jOIN  ck_versions mv
	ON mv.id = mpe.last_version
	WHERE mv.aprovada = 1
) AS mae
ON mae.id_pessoa = v.mae
WHERE v.aprovada = 1
AND pe.id = 3;
    */
}