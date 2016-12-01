import {Router, Request, Response, NextFunction} from 'express';
import {UsersRepository} from '../server/db/queries/UsersRepository';
const config = require('../config');
const jwt = require('jsonwebtoken');

export class TokenChecker {
    protected router: Router;
    protected repository : UsersRepository;

    constructor() {
        this.router = Router();
        this.repository = new UsersRepository();
        this.registerAuthorization();
    }

    private registerAuthorization() {
        this.router.use((req: Request, res: Response, next: NextFunction) => {

            let token = req.body.token || req.query.token || req.headers['x-access-token'];
            let secret = config.secret;

            if (token) {

                jwt.verify(token, secret, (err, decoded) => {      
                    if (err) {
                        return res.json({ success: false, message: 'Failed to authenticate token.' });    
                    } else {
                        req['decoded'] = decoded;    
                        next();
                    }
                });

            } else {

                return res.status(403).send({ 
                    success: false, 
                    message: 'No token provided.' 
                });
    
            }
        })
    }

    public getRouter() {
        return this.router;
    }
}