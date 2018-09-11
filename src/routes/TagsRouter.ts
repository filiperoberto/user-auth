import { Request, Response, NextFunction} from 'express';
import {TagsRepository} from '../server/db/queries/TagsRepository';
import { TokenChecker } from './TokenChecker';

class TagsRouter extends TokenChecker {
    private tagsRepository : TagsRepository;

    constructor() {
        super();
        this.tagsRepository = new TagsRepository();
    }

    private getAll(req: Request, res: Response, next: NextFunction) {

        const filtro = this.getFilter(req);

        this.tagsRepository.getAll(filtro).then( tags => {
            return this.tagsRepository.count().then(count => {
                res.send({ count : count[0].count, content : tags });
            }).catch( er => res.status(500).send(er))
            
        }).catch( er => res.status(500).send(er))
    }

    private findOne(req: Request, res: Response, next: NextFunction) {

        const id = req.params.id;

        this.doFindOne(id, res);
    }

    private doFindOne(id: any, res: Response) {
        return this.tagsRepository.findOne(id).then(tags => {
            res.send(tags[0]);
        }).catch(er => res.status(500).send(er));
    }

    private edit(req: Request, res: Response, next: NextFunction) {

        const id = req.params.id;
        const tag = req.body;

        if(!this.isAdmin(req)) {
            return this.sendUnauthorizedMessage(res);
        }

        this.tagsRepository.edit(id,tag).then( () => {

            return this.doFindOne(id, res);
            
        }).catch( er => res.status(500).send(er))
    }

    private create(req: Request, res: Response, next: NextFunction) {

        const tag = req.body;

        if(!this.isAdmin(req)) {
            return this.sendUnauthorizedMessage(res);
        }

        this.tagsRepository.create(tag).then( id => {

            return this.doFindOne(id, res);
            
        }).catch( er => res.status(500).send(er))
    }

    public init() {
        this.router.get('/',(req: Request, res: Response, next: NextFunction) => this.getAll(req,res,next));
        this.router.get('/:id',(req: Request, res: Response, next: NextFunction) => this.findOne(req,res,next));
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
        return [];
    }
}

const tagsRoutes = new TagsRouter();
tagsRoutes.init();

export default tagsRoutes.getRouter();