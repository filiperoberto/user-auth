import * as Knex from 'knex';
const knex : Knex = require('../Connection');
const sha1 = require('sha1');

export class UsersRepository {

    public getAll() {
        return knex.select('id','role','created','modified','name','website','description','picture','reputition').from('ck_users');
    }

    public getUserByUsernameAndPassword(username : string, password : string) {

        const salt = 'rzl5wxovlzbjlcvljl1vuxuyaxrhfpvkq58pvdzg';
        const hash = sha1(salt+password);
        return knex.select().from('ck_users').where({'username' : username, 'password' : hash}).limit(1);
    }

}