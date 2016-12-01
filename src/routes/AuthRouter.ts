import {Router, Request, Response, NextFunction} from 'express';
import {UsersRepository} from '../server/db/queries/UsersRepository';
import * as Knex from 'knex';
const config = require('../config');
const jwt = require('jsonwebtoken');

class AuthRouter {
    router: Router;
    private repository : UsersRepository;

    constructor() {
        this.router = Router();
        this.repository = new UsersRepository();
    }

    private authenticate(req: Request, res: Response, next: NextFunction) {
        const username = req.body.username;
        const password = req.body.password;
        
        this.repository.getUserByUsernameAndPassword(username, password).then( (user : any[]) => {
            if(user.length > 0) {

                let token = this.getToken(user[0]);

                res.status(200);
                res.json({ token : token});
            } else {
                res.status(401);
                res.json({});
            }
        })
    }

    private register(req: Request, res: Response, next: NextFunction) {
        const username = req.body.username;
        const password = req.body.password;

        this.repository.register(username, password).then( id => {

            this.repository.getById(id).then( user => {

                let token = this.getToken(user[0]);

                res.status(201);
                res.json({ token : token});
            })
        })
    }

    public init() {
        this.router.post('/login',(req: Request, res: Response, next: NextFunction) => this.authenticate(req,res,next));
        this.router.post('/register',(req: Request, res: Response, next: NextFunction) => this.register(req,res,next));
    }

    private getToken(user) : string {
        let secret = config.secret;
        return jwt.sign(user, secret, {
          expiresIn: '1d'
        });
    }

}


const exportRoutes = new AuthRouter();
exportRoutes.init();

export default exportRoutes.router;