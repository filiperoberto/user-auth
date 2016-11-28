import {Router, Request, Response, NextFunction} from 'express';
import {VersiclesRepository} from '../server/db/queries/VersiclesRepository';
import * as Knex from 'knex';

class VersiclesRouter {
    router: Router;
    private repository : VersiclesRepository;

    constructor() {
        this.router = Router();

        //TODO - Talvez tirar o new 
        this.repository = new VersiclesRepository();
        this.init();
    }

    private getByVersion(req: Request, res: Response, next: NextFunction) {
        const vrs = req.params.vrs;

        this.repository.getByVersion(vrs).then( (versicles : any[]) => {
            res.send(versicles);
        })
    }

    private getByVersionAndBook(req: Request, res: Response, next: NextFunction) {
        const vrs = req.params.vrs;
        const liv = req.params.liv;

        this.repository.getByVersionAndBook(vrs,liv).then( (versicles : any[]) => {
            res.send(versicles);
        })
    }

    public init() {
        this.router.get('/:vrs',(req: Request, res: Response, next: NextFunction) => this.getByVersion(req,res,next));
        this.router.get('/:vrs/:liv',(req: Request, res: Response, next: NextFunction) => this.getByVersionAndBook(req,res,next));
    }
}

const versiclesRoutes = new VersiclesRouter();
versiclesRoutes.init();

export default versiclesRoutes.router;