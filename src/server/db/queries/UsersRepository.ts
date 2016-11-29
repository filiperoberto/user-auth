import * as Knex from 'knex';
const knex : Knex = require('../Connection');
const bcrypt = require('bcryptjs');

export class UsersRepository {

    public getAll() {
        return knex.select('id','role','created','modified','name','website','description','picture','reputition').from('ck_users');
    }

    public getUserByUsernameAndPassword(username : string, password : string) {
        //const hash = bcrypt.hashSync(password, 8);
        //console.log(hash);
        return knex.select().from('ck_users').where({'username' : username, 'password' : password}).limit(1);
    }

}
