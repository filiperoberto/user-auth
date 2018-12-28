import { Version } from './../models/Version';
import {Router, Request, Response, NextFunction} from 'express';
import {VersionsRepository} from '../server/db/queries/VersionsRepository';
import { TokenChecker } from './TokenChecker';
import { VersionsFilter } from '../models/VersionsFilter';

class VersionsRouter extends TokenChecker {
    private versionRepository : VersionsRepository;

    constructor() {
        super();
        this.versionRepository = new VersionsRepository();
    }

    private getAll(req: Request, res: Response, next: NextFunction) {

        const filter = this.getFilter(req);

        this.versionRepository.getAll(filter).then( versions => {
            return this.versionRepository.count(filter).then(count => {
                res.send({ count : count[0].count, content: versions});
            })
        }).catch( er => res.status(500).send(er))
    }

    private getById(req: Request, res: Response, next: NextFunction) {
        const id = parseInt(req.params.id);

        this.versionRepository.getById(id).then( (version : any[]) => {
            if(version.length > 0) {
                res.send(version.pop());    
            }
            else {
                res.sendStatus(404);
            }
        }).catch( er => res.status(500).send(er))
    }

    private getMaxVersion(req: Request, res: Response, next: NextFunction) {
        const id = parseInt(req.params.id);

        this.versionRepository.getLastVersion(id).then( (version : Version[]) => {
            if(version.length > 0) {
                res.send(version.pop());    
            }
            else {
                res.sendStatus(404);
            }
        }).catch( er => res.status(500).send(er))
    }

    protected getFilter(req: Request, defaultLimit?: number) : VersionsFilter {
        let filter = super.getFilter(req,defaultLimit) as VersionsFilter;

        if(req.query.person) {
            filter.person = req.query.person;
        }

        filter.user = this.getLoggedUserId(req) as any;

        if(req.query.admin) {
            filter.admin = req.query.admin && this.isAdmin(req);
        }
        if(filter.admin) {
            delete filter.user;
        }

        return filter;
    }

    protected edit(req: Request, res: Response, next: NextFunction) {
        if(!this.isAdmin(req)) {
            return this.sendUnauthorizedMessage(res);
        }

        const id = req.params.id;

        const version = {
            aprovada : req.body.aprovada
        } as any;

        this.versionRepository.edit(id,version).then(() => {
            return this.versionRepository.getById(id).then( (version : any[]) => {
                if(version.length > 0) {
                    res.send(version.pop());    
                }
                else {
                    res.sendStatus(404);
                }
            })
        }).catch( er => res.status(500).send(er))
    }

    public init() {
        this.router.get('/',(req: Request, res: Response, next: NextFunction) => this.getAll(req,res,next));
        this.router.get('/:id',(req: Request, res: Response, next: NextFunction) => this.getById(req,res,next));
        this.router.get('/max/:id',(req: Request, res: Response, next: NextFunction) => this.getMaxVersion(req,res,next));
        this.router.put('/:id',(req: Request, res: Response, next: NextFunction) => this.edit(req,res,next));
    }

    protected getIgnoredPaths() : string[] {
        return [];
    }

    protected getIgnoredMethods() : string[] {
        return ['OPTIONS'];
    }

    protected getIgnoredPathAndMethos(): RegExp[] {
        return [];
    }
}

const versionsRoutes = new VersionsRouter();
versionsRoutes.init();

export default versionsRoutes.getRouter();