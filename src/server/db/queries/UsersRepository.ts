import * as Knex from 'knex';
const knex : Knex = require('../Connection');
const sha1 = require('sha1');
const config = require('../../../config');

export class UsersRepository {

    public getAll() {
        return knex.select('id','role','created','modified','name','website','description','picture','reputition').from('ck_users');
    }

    public count() {
        return knex.count('id as count').from('ck_users');
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

    public editProfile(id : string, name : string, website : string, description : string) {
        let obj = this.getUpdateObject(name,website,description);
        return knex('ck_users').update(obj).where('id',id);
    }

    public changePassword(id : string, password : string) {
        let hash = this.hash(password)
        return knex('ck_users').update({password : hash}).where('id',id);
    }

    private getUpdateObject(name : string, website : string, description : string) {
        let obj : any = {};
        obj.modified = knex.fn.now();
        if(name) obj.name = name;
        if(website) obj.website = website;
        if(description) obj.description = description;
        return obj;
    }

    private hash(password : string) : string {
        const salt = config.salt;
        return sha1(salt+password);
    }

}
