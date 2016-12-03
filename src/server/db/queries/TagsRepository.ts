import * as Knex from 'knex';
const knex : Knex = require('../Connection');

export class TagsRepository {

    public getAll() {
        return knex.select().from('ck_tags');
    }

}