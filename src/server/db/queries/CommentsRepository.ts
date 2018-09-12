import * as Knex from 'knex';
import { CommentsFilter } from '../../../models/CommentsFilter';
import { Comment } from '../../../models/Comment';
const knex: Knex = require('../Connection');

export class CommentsRepository {
    
    public findOne(id: number, user_id: number, admin : boolean) {

        let q = knex('ck_comments')
            .select('ck_comments.*','ck_users.name')
            .innerJoin('ck_users','ck_users.id','ck_comments.user_id')
            .where('ck_comments.id',id);

        if(!admin) {
            q.whereWrapped(function(){
                this.where('ck_comments.visible',1).orWhere('ck_comments.user_id',user_id)
            })
        }
        return q;
    }

    public findAll(filter: CommentsFilter, user_id: number, admin : boolean) {

        let query = knex('ck_comments')
            .select('ck_comments.*','ck_users.name')
            .innerJoin('ck_users','ck_users.id','ck_comments.user_id');

        if(filter.version) {
            query.where('ck_comments.version_id',filter.version);
        }

        if(!admin) {
            query.whereWrapped(function(){
                this.where('ck_comments.visible',1).orWhere('ck_comments.user_id',user_id)
            })
        }

        query.limit(filter.limit).offset(filter.offset);
        
        filter.orderBy.forEach(order => query.orderBy(order.orderBy, order.direction))

        return query;
    }

    public create(comment: Comment, user_id: number) {
        delete comment.id;
        comment.user_id = user_id;
        comment.created = knex.fn.now() as any;
        return knex('ck_comments').insert([comment]);
    }

    public edit(comment: Comment, id:number) {
        delete comment.id;
        delete comment.version_id;
        delete comment.user_id;
        delete comment.created;
        comment.modified = knex.fn.now() as any;
        return knex('ck_comments').update(comment).where({'id' : id});
    }

    public count(filter: CommentsFilter, user_id: number, admin : boolean) {
        let query = knex('ck_comments').count('ck_comments.id as count');

        if(filter.version) {
            query.where('ck_comments.version_id',filter.version);
        }

        if(!admin) {
            query.whereWrapped(function(){
                this.where('ck_comments.visible',1).orWhere('ck_comments.user_id',user_id)
            })
        }

        return query;
    }

}