import * as Knex from 'knex';
import { Filter } from '../../../util/filter';
import { User } from '../../../models/User';
const knex : Knex = require('../Connection');
const sha1 = require('sha1');
const config = require('../../../config');

export class UsersRepository {

    public getAll(filter : Filter) {
        let query = knex.select('id','role','created','modified','name','website','description','picture','reputition')
            .from('ck_users');

            query.limit(filter.limit).offset(filter.offset);
        
        filter.orderBy.forEach(order => query.orderBy(order.orderBy, order.direction));

        return query;
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

    public editProfile(id : string, user: User) {
        let obj = this.getUpdateObject(user);
        return knex('ck_users').update(obj).where('id',id);
    }

    public changePassword(id : string, password : string) {
        let hash = this.hash(password)
        return knex('ck_users').update({password : hash}).where('id',id);
    }

    private getUpdateObject(user: User) {
        let obj : any = {};
        obj.modified = knex.fn.now();
        if(user.name) obj.name = user.name;
        if(user.website) obj.website = user.website;
        if(user.description) obj.description = user.description;
        if(user.role) obj.role = user.role;
        return obj;
    }

    private hash(password : string) : string {
        const salt = config.salt;
        return sha1(salt+password);
    }

}
