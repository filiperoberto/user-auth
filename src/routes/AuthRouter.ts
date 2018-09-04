import {Router, Request, Response, NextFunction} from 'express';
import {TokenChecker} from './TokenChecker';
const config = require('../config');
const jwt = require('jsonwebtoken');

class AuthRouter extends TokenChecker {

    constructor() {
        super();
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
        }).catch( er => res.sendStatus(500));
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
        }).catch( er => res.sendStatus(500))
    }

    private changePassword(req: Request, res: Response, next: NextFunction) {
        const password = req.body.password;
        const id = this.getLoggedUserId(req);

        this.repository.changePassword(id, password)
            .then( data => res.sendStatus(201))
            .catch( er => res.sendStatus(500))
    }

    public init() {
        this.router.post('/login',(req: Request, res: Response, next: NextFunction) => this.authenticate(req,res,next));
        this.router.post('/register',(req: Request, res: Response, next: NextFunction) => this.register(req,res,next));
        this.router.post('/password',(req: Request, res: Response, next: NextFunction) => this.changePassword(req,res,next));
    }

    private getToken(user) : string {
        let secret = config.secret;
        return jwt.sign(user, secret, {
          expiresIn: '1d'
        });
    }

    protected getIgnoredPaths() : string[] {
        return ['/login','/register'];
    }

    protected getIgnoredMethods() : string[] {
        return [];
    }

    protected getIgnoredPathAndMethos(): RegExp[] {
        return [];
    }

}

const exportRoutes = new AuthRouter();
exportRoutes.init();

export default exportRoutes.getRouter();