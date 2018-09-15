import { Conjuges } from './../../../models/Conjuges';
import * as Knex from 'knex';
const knex: Knex = require('../Connection');

class ConjugesRepository {

    public delete(id: number) {
        return knex('ck_conjuges')
            .where('marido', id).orWhere('mulher',id)
            .del()
    }

    public add(conjuges : Conjuges[]) {
        return knex('ck_conjuges').insert(conjuges);
    }
}

export default new ConjugesRepository();