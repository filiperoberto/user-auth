import {Router, Request, Response, NextFunction} from 'express';
import {PeopleRepository} from '../server/db/queries/PeopleRepository';

class PeopleRouter {
    router: Router;
    private repository : PeopleRepository;

    constructor() {
        this.router = Router();

        //TODO - Talvez tirar o new 
        this.repository = new PeopleRepository();
        this.init();
    }

    private getAll(req: Request, res: Response, next: NextFunction) {
        this.repository.getAll().then( person => {
            res.send(person);
        }).catch( er => res.sendStatus(500))
    }

    private getById(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        this.repository.getById(id).then( (person : any[]) => {
            res.send(person[0]);
        }).catch( er => res.sendStatus(500))
    }

    public init() {
        this.router.get('/',(req: Request, res: Response, next: NextFunction) => this.getAll(req,res,next));
        this.router.get('/:id',(req: Request, res: Response, next: NextFunction) => this.getById(req,res,next));
    }
}

const peopleRoutes = new PeopleRouter();
peopleRoutes.init();

export default peopleRoutes.router;