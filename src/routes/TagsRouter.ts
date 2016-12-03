import {Router, Request, Response, NextFunction} from 'express';
import {TagsRepository} from '../server/db/queries/TagsRepository';

class TagsRouter {
    router: Router;
    private repository : TagsRepository;

    constructor() {
        this.router = Router();

        //TODO - Talvez tirar o new 
        this.repository = new TagsRepository();
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

const tagsRoutes = new TagsRouter();
tagsRoutes.init();

export default tagsRoutes.router;