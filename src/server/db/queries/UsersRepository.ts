import * as Knex from 'knex';
const knex : Knex = require('../Connection');
const sha1 = require('sha1');
const config = require('../../../config');

export class UsersRepository {

    public getAll() {
        return knex.select('id','role','created','modified','name','website','description','picture','reputition').from('ck_users');
    }

    public getById(id : number) {
        return knex.select('id','role','created','modified','name','website','description','picture','reputition').from('ck_users').where({'id':id});
    }

    public getUserByUsernameAndPassword(username : string, password : string) {
        const hash = this.hash(password);
        return knex.select('id','role','created','modified','name','website','description','picture','reputition').from('ck_users').where({'username' : username, 'password' : hash}).limit(1);
    }

    public register(username : string, password : string) {
        const hash = this.hash(password);
        return knex('ck_users').insert([{ username : username , password : hash, created : knex.fn.now(), modified : knex.fn.now(), email : username}]);
    }

    private hash(password : string) : string {
        const salt = config.salt;
        return sha1(salt+password);
    }

}
