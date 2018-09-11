import { TokenChecker } from "./TokenChecker";
import { PostsRepository } from "../server/db/queries/PostsRepository";
import { Request, Response, NextFunction} from 'express';

class PostsRouter extends TokenChecker {

    private postRepository : PostsRepository;

    constructor() {
        super();
        this.postRepository = new PostsRepository();
    }

    private getAll(req: Request, res: Response, next: NextFunction) {

        const filtro = this.getFilter(req);

        this.postRepository.getAll(filtro).then( tags => {
            return this.postRepository.count().then(count => {
                res.send({ count : count[0].count, content : tags });
            }).catch( er => res.status(500).send(er))
            
        }).catch( er => res.status(500).send(er))
    }

    public init() {
        this.router.get('/',(req: Request, res: Response, next: NextFunction) => this.getAll(req,res,next));
        //this.router.get('/:id',(req: Request, res: Response, next: NextFunction) => this.findOne(req,res,next));
        //this.router.put('/:id',(req: Request, res: Response, next: NextFunction) => this.edit(req,res,next));
        //this.router.post('/',(req: Request, res: Response, next: NextFunction) => this.create(req,res,next));
    }

    protected getIgnoredPaths() : string[] {
        return [];
    }

    protected getIgnoredMethods() : string[] {
        return [];
    }

    protected getIgnoredPathAndMethos(): RegExp[] {
        return [];
    }

}

const tagsRoutes = new PostsRouter();
tagsRoutes.init();

export default tagsRoutes.getRouter();