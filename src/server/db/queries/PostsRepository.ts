import * as Knex from 'knex';
import { Filter } from '../../../util/filter';
import { Post } from '../../../models/Post';
import joinjs from 'join-js';
const knex : Knex = require('../Connection');

const resultMaps = [
    { 
        mapId: 'postMap',
        idProperty: 'id',
        properties: ['title','body','created','modified','public'],
        collections: [
            {name : 'autor', mapId: 'autorMap', columnPrefix: 'autor_'},
            {name: 'tags', mapId: 'tagMap', columnPrefix: 'tag_'}
        ]
    },
    {
        mapId: 'autorMap',
        idProperty: 'id',
        properties: ['name','id']
    },
    {
        mapId: 'tagMap',
        idProperty: 'id',
        properties: ['texto','id','classe']
    }
]


export class PostsRepository {

    public getAll(filter: Filter, like?: string) {

        let query = knex('ck_posts').select('ck_posts.*','ck_users.id as autor_id','ck_users.name as autor_name','ck_tags.texto as tag_texto','ck_tags.classe as tag_classe','ck_tags.id as tag_id')
            .innerJoin('ck_users','ck_users.id','ck_posts.user_id')
            .leftOuterJoin('ck_post_to_tag','ck_post_to_tag.post','ck_posts.id')
            .leftOuterJoin('ck_tags','ck_post_to_tag.tag','ck_tags.id')
            .whereIn('ck_posts.id', function() {

                this.select('id').from(function () {
                    let q = this.select('ck_posts.*').from('ck_posts')
                        .leftOuterJoin('ck_post_to_tag','ck_post_to_tag.post','ck_posts.id')
                        .leftOuterJoin('ck_tags','ck_post_to_tag.tag','ck_tags.id');
    
                    if(filter['tag']) {
                        q.where('ck_tags.id',filter['tag']);
                    }
    
                    filter.orderBy.forEach(order => {
                        q.orderBy(order.orderBy, order.direction);
                    })
    
                    q.groupBy('ck_posts.id').limit(filter.limit).offset(filter.offset);
    
                    q.as('o');
                })
            })
        return query.then(resultSet => {
            return joinjs.map(resultSet, resultMaps, 'postMap');
        });
    }

    public create(object: Post, user_id : number) {
        object.created = knex.fn.now();
        object.user_id = user_id;
        return knex('ck_posts').insert([object]);
    }

    public edit(id : number, object: Post) {
        delete object.id;
        delete object.user_id;
        delete object.created;

        object.modified = knex.fn.now();
        return knex('ck_posts').update(object).where({'id' : id});
    }

    public findOne(id: number) {
        return knex.select().from('ck_posts').where({id : id}).then(resultSet => {
            return joinjs.map(resultSet, resultMaps, 'postMap');
        });;
    }

    public count(like?: string) {
        let query = knex('ck_posts').count('id as count');
        
        if(like) {
            query.andWhere('title','like',`%${like}%`)
        }
        return query;
    }
    
}