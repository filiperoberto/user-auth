import * as Knex from 'knex';
const knex : Knex = require('../Connection');

export class PeopleRepository {

    public getAll() {
        return knex.select().from('ck_pessoas');
    }
}