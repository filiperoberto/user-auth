import {Router, Request, Response, NextFunction} from 'express';
import {UsersRepository} from '../server/db/queries/UsersRepository';
const config = require('../config');
const jwt = require('jsonwebtoken');

export abstract class TokenChecker {
    protected router: Router;
    protected repository : UsersRepository;

    protected abstract getIgnoredPaths() : string[];
    protected abstract getIgnoredMethods() : string[];

    constructor() {
        this.router = Router();
        this.repository = new UsersRepository();
        this.registerAuthorization();
    }

    private registerAuthorization() {
        this.router.use((req: Request, res: Response, next: NextFunction) => {
            if(this.bypass(req)) {
                next();
            }
            else {
                this.checkToken(req, res, next);
            }
        })
    }

    private checkToken(req: Request, res: Response, next: NextFunction) {
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
    }

    protected getLoggedUserId(req: Request) : string {
        return req['decoded'].id;
    }

    protected getIdFromRequest(req: Request) {
        const id = req.params.id;

        if(id === 'me') {
            return this.getLoggedUserId(req);
        }
        return id;
    }

    //TODO - Testar
    private bypass(req: Request) : boolean {
        return this.getIgnoredPaths().indexOf(req.path) !== -1 || this.getIgnoredMethods().indexOf(req.method) !== -1;
    }

    public getRouter() {
        return this.router;
    }
}