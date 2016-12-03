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
        this.repository.getAll().then( tags => {
            res.send(tags);
        }).catch( er => res.sendStatus(500))
    }

    public init() {
        this.router.get('/',(req: Request, res: Response, next: NextFunction) => this.getAll(req,res,next));
    }
}

const peopleRoutes = new PeopleRouter();
peopleRoutes.init();

export default peopleRoutes.router;