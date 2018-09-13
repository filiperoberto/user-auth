import { TokenChecker } from "./TokenChecker";
import { Request, Response, NextFunction} from 'express';
import { CommentsRepository } from "../server/db/queries/CommentsRepository";
import { CommentsFilter } from "../models/CommentsFilter";
import { Comment } from '../models/Comment';

class CommentsRouter extends TokenChecker {

    private commentsRepository : CommentsRepository;

    constructor() {
        super();
        this.commentsRepository = new CommentsRepository();
    }

    private getById(req: Request, res: Response, next: NextFunction) {
        const id = parseInt(req.params.id);
        const loggedUser = this.getLoggedUserId(req) as any;
        const admin = this.isAdmin(req);

        this.doGetOne(id,loggedUser,admin).then(comment => {
            res.send(comment);
        }).catch( er => res.status(er.status).send(er.error))
    }

    private doGetOne(id: number, user_id: number, admin : boolean) : Promise<Comment> {
        return new Promise((resolve,reject) => {
            return this.commentsRepository.findOne(id,user_id,admin).then( (comments : any[]) => {
                if(comments.length > 0) {
                    resolve(comments.pop());
                }
                else {
                    reject({status: 404, error: {}})
                }
            }).catch( er => reject({status: 500, error: er}))
        })
    }

    private getAll(req: Request, res: Response, next: NextFunction) {
        const filter = this.getFilter(req);
        const loggedUser = this.getLoggedUserId(req) as any;
        const admin = this.isAdmin(req);

        this.commentsRepository.findAll(filter,loggedUser,admin).then( (comments : any[]) => {

            return this.commentsRepository.count(filter,loggedUser,admin).then( count => {
                res.send({ count : count[0].count, content : comments})
            })
        }).catch( er => res.status(500).send(er))
    }

    private create(req: Request, res: Response, next: NextFunction) {

        if(this.isViewer(req)) {
            return this.sendUnauthorizedMessage(res);
        }

        const comment = req.body;
        const loggedUser = this.getLoggedUserId(req) as any;
        const admin = this.isAdmin(req);

        this.commentsRepository.create(comment,loggedUser).then( id => {

            return this.commentsRepository.findOne(id,loggedUser,admin).then((comments : any[]) => {
                if(comments.length > 0) {
                    res.send(comments.pop());
                }
                else {
                    res.sendStatus(404);
                }})

        }).catch( er => res.status(500).send(er))
    }

    private edit(req: Request, res: Response, next: NextFunction) {

        if(this.isViewer(req)) {
            return this.sendUnauthorizedMessage(res);
        }

        const id = parseInt(req.params.id);
        const comment = req.body;
        const loggedUser = this.getLoggedUserId(req) as any;
        const admin = this.isAdmin(req);

        this.doGetOne(id,loggedUser,admin).then(com => {
            if(com.user_id != loggedUser && !admin) {
                return this.sendUnauthorizedMessage(res);
            }

            return this.commentsRepository.edit(comment,id).then(() => {
                return this.doGetOne(id,loggedUser,admin).then(comment => {
                    res.send(comment);
                }).catch( er => res.status(er.status).send(er.error))
            })
        }).catch( er => res.status(er.status).send(er.error))
    }

    protected getFilter(req: Request, defaultLimit?: number) : CommentsFilter {
        let filter = super.getFilter(req,defaultLimit) as CommentsFilter;

        if(req.query.version) {
            filter.version = req.query.version;
        }

        return filter;
    }

    public init() {
        this.router.get('/:id',(req: Request, res: Response, next: NextFunction) => this.getById(req,res,next));
        this.router.get('/',(req: Request, res: Response, next: NextFunction) => this.getAll(req,res,next));
        this.router.post('/',(req: Request, res: Response, next: NextFunction) => this.create(req,res,next));
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

const versionsRoutes = new CommentsRouter();
versionsRoutes.init();

export default versionsRoutes.getRouter();