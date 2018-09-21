import { Request, Response, NextFunction} from 'express';
import {PeopleRepository} from '../server/db/queries/PeopleRepository';
import { TokenChecker } from './TokenChecker';
import { PeopleFilter } from '../models/PeopleFilter';
import { PeopleService } from '../services/PeopleService';
import { VersionsRepository } from '../server/db/queries/VersionsRepository';
import { Version } from '../models/Version';

class PeopleRouter extends TokenChecker {
    
    private peopleRepository : PeopleRepository;
    private peopleService : PeopleService;

    constructor() {
        super();
        this.peopleRepository = new PeopleRepository();
        this.peopleService = new PeopleService(this.peopleRepository,new VersionsRepository());
    }

    private getAll(req: Request, res: Response, next: NextFunction) {

        const filter = this.getFilter(req);

        this.peopleRepository.getAll(filter).then( person => {
            return this.peopleRepository.count(filter).then(count => {
                res.send({ count : count[0].count, content : person});
            })
        }).catch( er => res.status(500).send(er))
    }

    protected getFilter(req: Request, defaultLimit?: number) : PeopleFilter {
        let filter = super.getFilter(req,defaultLimit) as PeopleFilter;

        if(req.query.name) {
            filter.name = req.query.name;
        }

        return filter;
    }

    private getById(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        this.peopleRepository.getById(id).then( (person : any[]) => {
            if(person.length > 0) {
                res.send(person.pop());
            } else {
                res.sendStatus(404);
            }
        }).catch( er => res.status(500).send(er))
    }

    private edit(req: Request, res: Response, next: NextFunction) {

        if(this.isViewer(req)) {
            return this.sendUnauthorizedMessage(res);
        }

        const id = req.params.id;
        const version = req.body as Version;
        version.user_id = this.getLoggedUserId(req) as any;
        version.aprovada = this.isAdmin(req) ? true : null;
        this.peopleService.edit(version,id).then(version => {
            res.send(version);
        }).catch( er => res.status(er.status).send(er.error))
    }

    private create(req: Request, res: Response, next: NextFunction) {

        if(this.isViewer(req)) {
            return this.sendUnauthorizedMessage(res);
        }

        const version = req.body as Version;
        version.user_id = this.getLoggedUserId(req) as any;
        version.aprovada = this.isAdmin(req) ? true : null;
        this.peopleService.create(version).then(version => {
            res.send(version);
        }).catch( er => res.status(er.status).send(er.error))
    }

    private dynamicTree(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        this.peopleService.getDynamicTree(id).then(people => {
            res.send(people);
        }).catch( er => res.status(er.status).send(er.error))
    }

    private getMostCommonNames(req: Request, res: Response, next: NextFunction) {
        const quantity = req.params.quantity;

        this.peopleRepository.getMostCommonNames(quantity).then(values => {
            res.send(values);
        }).catch(er => res.status(500).send(er))
    }

    private getCountByGenger(req: Request, res: Response, next: NextFunction) {
        const quantity = req.params.quantity;

        this.peopleRepository.countByGenger(quantity).then(values => {
            res.send(values);
        }).catch(er => res.status(500).send(er))
    }

    private count(req: Request, res: Response, next: NextFunction) {
        const filter = this.getFilter(req);

        this.peopleRepository.count(filter).then(count => {
            res.send({ count : count[0].count });
        }).catch(er => res.status(500).send(er))
    }

    public init() {
        this.router.get('/',(req: Request, res: Response, next: NextFunction) => this.getAll(req,res,next));
        this.router.get('/dynamic/:id',(req: Request, res: Response, next: NextFunction) => this.dynamicTree(req,res,next));
        this.router.get('/:id',(req: Request, res: Response, next: NextFunction) => this.getById(req,res,next));
        this.router.get('/chart/names/:quantity',(req: Request, res: Response, next: NextFunction) => this.getMostCommonNames(req,res,next));
        this.router.get('/chart/genger/:quantity',(req: Request, res: Response, next: NextFunction) => this.getCountByGenger(req,res,next));
        this.router.get('/chart/count',(req: Request, res: Response, next: NextFunction) => this.count(req,res,next));
        this.router.put('/:id',(req: Request, res: Response, next: NextFunction) => this.edit(req,res,next));
        this.router.post('/',(req: Request, res: Response, next: NextFunction) => this.create(req,res,next));
    }

    protected getIgnoredPaths() : string[] {
        return [];
    }

    protected getIgnoredMethods() : string[] {
        return ['OPTIONS'];
    }

    protected getIgnoredPathAndMethos(): RegExp[] {
        return [/GET\//, /GET\/\d+/ ];
    }
}

const peopleRoutes = new PeopleRouter();
peopleRoutes.init();

export default peopleRoutes.getRouter();