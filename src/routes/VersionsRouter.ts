import {Router, Request, Response, NextFunction} from 'express';
import {VersionsRepository} from '../server/db/queries/VersionsRepository';
import * as Knex from 'knex';

class VersionsRouter {
    router: Router;
    private repository : VersionsRepository;

    constructor() {
        this.router = Router();

        //TODO - Talvez tirar o new 
        this.repository = new VersionsRepository();
        this.init();
    }

    private getAll(req: Request, res: Response, next: NextFunction) {
        this.repository.getAll().then( versions => {
            res.send(versions);
        })
    }

    private getById(req: Request, res: Response, next: NextFunction) {
        const id = parseInt(req.params.id);

        this.repository.getById(id).then( (version : any[]) => {
            if(version.length > 0) {
                res.send(version.pop());    
            }
            else {
                res.status(404);
                res.send();
            }
        } )
    }

    public init() {
        this.router.get('/',(req: Request, res: Response, next: NextFunction) => this.getAll(req,res,next));
        this.router.get('/:id',(req: Request, res: Response, next: NextFunction) => this.getById(req,res,next));
    }
}

const versionsRoutes = new VersionsRouter();
versionsRoutes.init();

export default versionsRoutes.router;