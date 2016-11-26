import * as Knex from 'knex';
const knex : Knex = require('../Connection');

export class VersionsRepository {

    private knex : Knex;

    contructor() {
        this.knex = knex;
    }

    public getAll() {
        return knex.select().from('versoes');
    }

}