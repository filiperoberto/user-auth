import * as Knex from 'knex';
import { Filter } from '../../../util/filter';
import { Tag } from '../../../models/Tag';
const knex : Knex = require('../Connection');

export class TagsRepository {

    public getAll(filter: Filter, like?: string) {

        let query = knex.select().from('ck_tags')
        
        if(like) {
            query.andWhere('texto','like',`%${like}%`);
        }

        query.limit(filter.limit).offset(filter.offset);
        
        filter.orderBy.forEach(order => {

            if(order.orderBy === 'name') {
                order.orderBy = 'texto';
            }

            query.orderBy(order.orderBy, order.direction);
        })
        
        return query;
    }

    public create(object: Tag) {
        return knex('ck_tags').insert([object]);
    }

    public edit(id : number, object: Tag) {
        delete object.id;
        return knex('ck_tags').update(object).where({'id' : id});
    }

    public findOne(id: number) {
        return knex.select().from('ck_tags').where({id : id});
    }

    public count(like?: string) {
        let query = knex('ck_tags').count('id as count');
        
        if(like) {
            query.andWhere('texto','like',`%${like}%`)
        }
        return query;
    }

}