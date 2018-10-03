import * as Knex from 'knex';
import { Post } from '../../../models/Post';
import joinjs from 'join-js';
import { PostFilter } from '../../../models/PostFilter';
const knex: Knex = require('../Connection');

const resultMaps = [
    {
        mapId: 'postMap',
        idProperty: 'id',
        properties: ['title', 'body', 'created', 'modified', 'public'],
        collections: [
            { name: 'tags', mapId: 'tagMap', columnPrefix: 'tag_' }
        ],
        associations: [
            { name: 'autor', mapId: 'autorMap', columnPrefix: 'autor_' }
        ]
    },
    {
        mapId: 'autorMap',
        idProperty: 'id',
        properties: ['name', 'id']
    },
    {
        mapId: 'tagMap',
        idProperty: 'id',
        properties: ['texto', 'id', 'classe']
    }
]


export class PostsRepository {

    public getAll(filter: PostFilter) {

        let query = knex('ck_posts').select('ck_posts.*', 'ck_users.id as autor_id', 'ck_users.name as autor_name', 'ck_tags.texto as tag_texto', 'ck_tags.classe as tag_classe', 'ck_tags.id as tag_id')
            .innerJoin('ck_users', 'ck_users.id', 'ck_posts.user_id')
            .leftOuterJoin('ck_post_to_tag', 'ck_post_to_tag.post', 'ck_posts.id')
            .leftOuterJoin('ck_tags', 'ck_post_to_tag.tag', 'ck_tags.id')
            .whereIn('ck_posts.id', function () {

                this.select('id').from(function () {
                    let q = this.select('ck_posts.*').from('ck_posts')
                        .leftOuterJoin('ck_post_to_tag', 'ck_post_to_tag.post', 'ck_posts.id')
                        .leftOuterJoin('ck_tags', 'ck_post_to_tag.tag', 'ck_tags.id');

                    if (filter.tag) {
                        q.where('ck_tags.id', filter.tag);
                    }

                    if (filter.user) {
                        q.where(function () {
                            this.where('ck_posts.user_id', filter.user).orWhere('ck_posts.public', 1)
                        })
                    } else {
                        q.where('ck_posts.public', 1)
                    }

                    filter.orderBy.forEach(order => {
                        q.orderBy(order.orderBy, order.direction);
                    })

                    q.groupBy('ck_posts.id').limit(filter.limit).offset(filter.offset);

                    q.as('o');
                })
            })

            filter.orderBy.forEach(order => {
                query.orderBy(order.orderBy, order.direction);
            })

        return query.then(resultSet => {
            return joinjs.map(resultSet, resultMaps, 'postMap');
        });
    }

    public findOne(id: number, userId: number) {

        let query = knex('ck_posts').select('ck_posts.*', 'ck_users.id as autor_id', 'ck_users.name as autor_name', 'ck_tags.texto as tag_texto', 'ck_tags.classe as tag_classe', 'ck_tags.id as tag_id')
            .innerJoin('ck_users', 'ck_users.id', 'ck_posts.user_id')
            .leftOuterJoin('ck_post_to_tag', 'ck_post_to_tag.post', 'ck_posts.id')
            .leftOuterJoin('ck_tags', 'ck_post_to_tag.tag', 'ck_tags.id')
            .where({ 'ck_posts.id': id });

        if (userId) {
            query.where(function () {
                this.where('ck_posts.user_id', userId).orWhere('ck_posts.public', 1)
            })
        } else {
            query.where('ck_posts.public', 1)
        }

        return query.then(resultSet => {
            return joinjs.map(resultSet, resultMaps, 'postMap');
        });
    }

    public create(object: Post, user_id: number) {
        object.created = knex.fn.now();
        object.user_id = user_id;
        return knex('ck_posts').insert([object]);
    }

    public edit(id: number, object: Post) {
        delete object.id;
        delete object.user_id;
        delete object.created;

        object.modified = knex.fn.now();
        return knex('ck_posts').update(object).where({ 'id': id });
    }

    public count(filter: PostFilter) {
        let query = knex('ck_posts').count('ck_posts.id as count')

        if (filter.tag) {
            query.leftOuterJoin('ck_post_to_tag', function () {
                this.on('ck_post_to_tag.post', 'ck_posts.id').andOn('ck_post_to_tag.post', filter.tag)
            })
            .where('ck_tags.id', filter.tag);
        }

        if (filter.user) {
            query.where(function () {
                this.where('ck_posts.user_id', filter.user).orWhere('ck_posts.public', 1)
            })
        } else {
            query.where('ck_posts.public', 1)
        }
        return query;
    }

}