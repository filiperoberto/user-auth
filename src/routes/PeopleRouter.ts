import { Request, Response, NextFunction} from 'express';
import {PeopleRepository} from '../server/db/queries/PeopleRepository';
import { TokenChecker } from './TokenChecker';
import { PeopleFilter } from '../models/PeopleFilter';

class PeopleRouter extends TokenChecker {
    
    private peopleRepository : PeopleRepository;

    constructor() {
        super();
        this.peopleRepository = new PeopleRepository();
    }

    private getAll(req: Request, res: Response, next: NextFunction) {

        const filter = this.getFilter(req);

        /*this.peopleRepository.getAll(filter).then( person => {
            res.send(person);
        }).catch( er => res.sendStatus(500))*/
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
            res.send(person[0]);
        }).catch( er => res.status(500).send(er))
    }

    public init() {
        this.router.get('/',(req: Request, res: Response, next: NextFunction) => this.getAll(req,res,next));
        this.router.get('/:id',(req: Request, res: Response, next: NextFunction) => this.getById(req,res,next));
    }

    protected getIgnoredPaths() : string[] {
        return [];
    }

    protected getIgnoredMethods() : string[] {
        return ['OPTIONS'];
    }

    protected getIgnoredPathAndMethos(): RegExp[] {
        return [/GET\//, /GET\/\d+/];
    }
}

const peopleRoutes = new PeopleRouter();
peopleRoutes.init();

export default peopleRoutes.getRouter();