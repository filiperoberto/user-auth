import * as Knex from 'knex';
const knex : Knex = require('../Connection');
const sha1 = require('sha1');
const config = require('../../../config');
import {Filter} from '../../../util/filter';

export class UsersRepository {

    public getAll(filter: Filter) {
        let query = knex.select('id','role','name','description')
            .from('users')
            .limit(filter.limit)
            .offset(filter.offset);


        filter.orderBy.forEach(order => {
            query.orderBy(order.orderBy, order.direction);
        })
        return query;
    }

    public incrementReputation(id: number) {
        return knex('users').increment('reputation', 1).where({'id':id});
    }

    public decrementReputation(id: number) {
        return knex('users').decrement('reputation', 1).where({'id':id});
    }

    public getReputation(id : number) {
        return  knex.select('reputation').from('users').where({'id':id});
    }

    public getById(id : number) {
        return knex.select('id','role','created','modified','name','website','description','picture','reputation','email','contact').from('users').where({'id':id});
    }

    public getUserByUsernameAndPassword(username : string, password : string) {
        const hash = this.hash(password);
        return knex.select('id','role','created','modified','name','website','description','picture','reputation','contact').from('users').where({'username' : username, 'password' : hash}).limit(1);
    }

    public resetPassword(username : string, random : number, password : string) {
        let hash = this.hash(password);
        return knex('users').update({password : hash, passwordChange : knex.fn.now(), random: null}).where({'username':username, 'random' : random});
    }

    public getUserByUsernameAndRandom(username : string, random : number) {
        return  knex.select('id').from('users').where({'username':username, 'random' : random});
    }

    public register(name: string, username : string, password : string, latitude : number, longitude : number) {
        const hash = this.hash(password);

        let user: any = {
            name: name,
            username : username,
            password : hash,
            created : knex.fn.now(),
            modified : knex.fn.now(),
            email : username
        }

        if(latitude && longitude) {
            user.latitude = latitude;
            user.longitude = longitude;
        }

        return knex('users').insert([user]);
    }

    public editProfile(id: string, user: any) {
        let obj = this.getUpdateObject(user);
        return knex('users').update(obj).where('id',id);
    }

    public setRandomNumber(username : string, random : number) {
        return knex('users').update({ random : random }).where('username',username);
    }

    public getUserEmailByUsername(username : string) {
        return knex.select('email').from('users').where({'username' : username}).limit(1);
    }

    public changePassword(id : string, password : string) {
        let hash = this.hash(password)
        return knex('users').update({password : hash, passwordChange : knex.fn.now()}).where('id',id);
    }

    private getUpdateObject(user: any) {

        let obj : any = {};
        for(let key in user) {
            if(user[key] !== undefined) {
                obj[key] = user[key];
            }
        }
        return obj;
    }

    private hash(password : string) : string {
        const salt = config.salt;
        return sha1(salt+password);
    }

}
