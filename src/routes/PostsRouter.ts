import { TokenChecker } from "./TokenChecker";
import { PostsRepository } from "../server/db/queries/PostsRepository";
import { Request, Response, NextFunction} from 'express';
import { PostFilter } from "../models/PostFilter";
import { Post } from "../models/Post";

class PostsRouter extends TokenChecker {

    private postRepository : PostsRepository;

    constructor() {
        super();
        this.postRepository = new PostsRepository();
    }

    private getAll(req: Request, res: Response, next: NextFunction) {

        const filtro = this.getFilter(req);
        filtro.user = this.getLoggedUserId(req) as any;

        this.postRepository.getAll(filtro).then( posts => {
            return this.postRepository.count().then(count => {
                res.send({ count : count[0].count, content : posts });
            }).catch( er => res.status(500).send(er))
            
        }).catch( er => res.status(500).send(er))
    }

    private findOne(req: Request, res: Response, next: NextFunction) {

        const id = req.params.id;
        const loggedUserId = this.getLoggedUserId(req) as any;

        this.doGetPost(id,loggedUserId).then(post => {
            res.send(post);
        }).catch(er => res.status(er.status).send(er.error))
    }

    private doGetPost(id: number, user : number) : Promise<Post> {
        return new Promise((resolve,reject) => {
            this.postRepository.findOne(id,user).then( posts => {
                if(posts && posts.length > 0) {
                    resolve(posts[0]);
                } else {
                    reject({ status : 404, error : {} })
                }
            }).catch( er => reject({ status : 500, error : er }))
        })
    }

    private edit(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        let post = req.body;
        const loggedUserId = this.getLoggedUserId(req) as any;

        this.doGetPost(id,loggedUserId).then(() => {
            this.postRepository.edit(id,post).then(() => {

                this.doGetPost(id,loggedUserId).then(p => {
                    res.send(p);
                }).catch(er => res.status(er.status).send(er.error))

            }).catch( er => res.status(500).send(er))
        }).catch(er => res.status(er.status).send(er.error))
    }

    private create(req: Request, res: Response, next: NextFunction) {
        let post = req.body;
        const loggedUserId = this.getLoggedUserId(req) as any;

        this.postRepository.create(post,loggedUserId).then(id => {
            this.doGetPost(id,loggedUserId).then(p => {
                res.send(p);
            }).catch(er => res.status(er.status).send(er.error))
        }).catch( er => res.status(500).send(er))
    }

    private publicar(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        const loggedUserId = this.getLoggedUserId(req) as any;
        
        let post = {
            public : req.body.public
        } as any;
        if(!this.isAdmin(req)) {
            return this.sendUnauthorizedMessage(res);
        }

        this.postRepository.edit(id,post).then(() => {

            this.doGetPost(id,loggedUserId).then(p => {
                res.send(p);
            }).catch(er => res.status(er.status).send(er.error))

        }).catch( er => res.status(500).send(er))
    }

    public init() {
        this.router.get('/',(req: Request, res: Response, next: NextFunction) => this.getAll(req,res,next));
        this.router.get('/:id',(req: Request, res: Response, next: NextFunction) => this.findOne(req,res,next));
        this.router.put('/:id',(req: Request, res: Response, next: NextFunction) => this.edit(req,res,next));
        this.router.put('/:id/public',(req: Request, res: Response, next: NextFunction) => this.publicar(req,res,next));
        this.router.post('/',(req: Request, res: Response, next: NextFunction) => this.create(req,res,next));
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

    protected getFilter(req: Request, defaultLimit?: number) : PostFilter {
        let filter = super.getFilter(req,defaultLimit) as PostFilter;

        if(req.query.user) {
            filter.user = parseInt(req.query.user);
        }
        if(req.query.tag) {
            filter.tag = parseInt(req.query.tag);
        }

        if(req.query.mostrarOcultos !== undefined) {
            filter.mostrarOcultos = req.query.mostrarOcultos;
        }

        return filter;
    }

}

const tagsRoutes = new PostsRouter();
tagsRoutes.init();

export default tagsRoutes.getRouter();