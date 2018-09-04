import {Router, Request, Response, NextFunction} from 'express';
import {UsersRepository} from '../server/db/queries/UsersRepository';
import {Filter} from '../util/filter';
const config = require('../config');
const jwt = require('jsonwebtoken');

export abstract class TokenChecker {
    protected router: Router;
    protected repository : UsersRepository;

    protected abstract getIgnoredPaths() : string[];
    protected abstract getIgnoredMethods() : string[];
    protected abstract getIgnoredPathAndMethos() : RegExp[];

    constructor() {
        this.router = Router();
        this.repository = new UsersRepository();
        this.registerAuthorization();
    }

    private registerAuthorization() {
        this.router.use((req: Request, res: Response, next: NextFunction) => {
            if(this.bypass(req)) {
                this.checkOptionalToken(req, res, next);
            }
            else {
                this.checkToken(req, res, next);
            }
        })
    }

    private checkOptionalToken(req: Request, res: Response, next: NextFunction) {
        let token = req.body.token || req.query.token || req.headers['x-access-token'];
        let secret = config.secret;

        if (token) {

            jwt.verify(token, secret, (err, decoded) => {
                if (err) {
                    next();
                } else {
                    req['decoded'] = decoded;
                    next();
                }
            });

        } else {
            next();
        }
    }

    private checkToken(req: Request, res: Response, next: NextFunction) {
        let token = req.body.token || req.query.token || req.headers['x-access-token'] || this.getBearerToken(req);
        let secret = config.secret;

        if (token) {

            jwt.verify(token, secret, (err, decoded) => {
                if (err) {
                    res.status(403);
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

    private getBearerToken(req: Request) {
        return req.headers['authorization'] ? (req.headers['authorization'] as any).split(' ')[1] : undefined;
    }

    protected getFilter(req: Request, defaultLimit?: number) : Filter {
        let filter = new Filter();

        if(defaultLimit !== undefined) {
            filter.limit = defaultLimit;
        }
        if(req.query.limit) {
            filter.limit = req.query.limit;
        }
        if(req.query.offset) {
            filter.offset = parseInt(req.query.offset);
        }
        if(req.query.orderBy) {

            var arr : string[] = req.query.orderBy;

            if(Array.isArray(arr)) {
                filter.orderBy = arr.map(val => {
    
                    let spplitted = val.split(',');
                    return {
                        orderBy : spplitted[0],
                        direction : spplitted[1] || 'asc'
                    }
    
                })
            } else {
                filter.orderBy = [
                    {
                        orderBy : req.query.orderBy,
                        direction : req.query.direction || 'asc'
                    }
                ]
            }

        }
        return filter;
    }

    protected getLoggedUserId(req: Request) : string {
        if(req['decoded']) {
            return req['decoded'].id;
        }
        return '0';
    }

    protected getLoggedRole(req: Request) {
        return req['decoded'].role;
    }

    protected isLogged(req: Request) : boolean {
        return this.getLoggedUserId(req) !== '0';
    }

    protected getIdFromRequest(req: Request) {
        const id = req.params.id;

        if(id === 'me') {
            return this.getLoggedUserId(req);
        }
        return id;
    }

    protected sendUnauthorizedMessage() {
        
    }

    //TODO - Testar
    private bypass(req: Request) : boolean {

        let metpath = req.method + req.path;

        let test = this.getIgnoredPathAndMethos().some( regex => regex.test(metpath) );
        return this.getIgnoredPaths().indexOf(req.path) !== -1 || this.getIgnoredMethods().indexOf(req.method) !== -1 || test;
    }

    public getRouter() {
        return this.router;
    }
}