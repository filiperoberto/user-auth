import {TokenChecker} from './TokenChecker';
import {Router, Request, Response, NextFunction} from 'express';

class UsersRouter extends TokenChecker {

    constructor() {
        super();
    }

    private getAll(req: Request, res: Response, next: NextFunction) {

        const filter = this.getFilter(req);

        if(!this.isAdmin(req)) {
            return this.sendUnauthorizedMessage(res);
        }

        this.repository.getAll(filter).then(users => {

            return this.repository.count().then(count => {
                res.send({ count : count[0].count , content : users});
            }) 
        }).catch( er => res.status(500).send(er));
    }

    private getById(req: Request, res: Response, next: NextFunction) {
        const id = this.getIdFromRequest(req);
        const loggedUser = this.getLoggedUserId(req);

        if(id != loggedUser && !this.isAdmin(req)) {
            return this.sendUnauthorizedMessage(res);
        }

        this.doGetById(id, res);
    }

    private doGetById(id: any, res: Response) {
        return this.repository.getById(id).then(users => {
            if (users && users.length > 0) {
                res.send(users[0]);
            }
            else {
                res.sendStatus(404);
            }
        }).catch( er => res.status(500).send(er));
    }

    private editMyUserProfile(req: Request, res: Response, next: NextFunction) {

        const user = req.body;
        const id = this.getLoggedUserId(req);

        this.doEditUser(user, req, id, res);
    }

    private editUserProfile(req: Request, res: Response, next: NextFunction) {
        const user = req.body;
        const id = this.getIdFromRequest(req);
        const loggedUser = this.getLoggedUserId(req);

        if(id != loggedUser && !this.isAdmin(req)) {
            return this.sendUnauthorizedMessage(res);
        }

        this.doEditUser(user, req, id, res);
    }

    private doEditUser(user: any, req: Request, id: any, res: Response) {
        delete user.id;
        delete user.created;
        if (!this.isAdmin(req)) {
            delete user.role;
            delete user.reputition;
        }
        this.repository.editProfile(id, user).then(data => {
            res.status(201);
            return this.doGetById(id, res);
        }).catch(er => res.status(500).send(er));
    }

    public init() {
        this.router.get('/',(req: Request, res: Response, next: NextFunction) => this.getAll(req,res,next));
        this.router.get('/:id',(req: Request, res: Response, next: NextFunction) => this.getById(req,res,next));
        this.router.put('/',(req: Request, res: Response, next: NextFunction) => this.editMyUserProfile(req,res,next));
        this.router.put('/:id',(req: Request, res: Response, next: NextFunction) => this.editUserProfile(req,res,next));
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

const exportRoutes = new UsersRouter();
exportRoutes.init();

export default exportRoutes.getRouter();