import {AuthoziredRouter} from './AuthoziredRouter';
import {Router, Request, Response, NextFunction} from 'express';
//import {UsersRepository} from '../server/db/queries/UsersRepository';
import * as Knex from 'knex';

class UsersRouter extends AuthoziredRouter {

    constructor() {
        super();
    }

    private getAll(req: Request, res: Response, next: NextFunction) {
        this.repository.getAll().then(users => {
            res.send(users);
        })
    }

    public init() {
        this.router.get('/',(req: Request, res: Response, next: NextFunction) => this.getAll(req,res,next));
    }

}

const exportRoutes = new UsersRouter();
exportRoutes.init();

export default exportRoutes.getRouter();