import {TokenChecker} from './TokenChecker';
import {Router, Request, Response, NextFunction} from 'express';

class UsersRouter extends TokenChecker {

    constructor() {
        super();
    }

    private getAll(req: Request, res: Response, next: NextFunction) {

        const role = this.getLoggedRole(req);
        const filter = this.getFilter(req);

        if(role !== 'admin') {
            return res.status(401).send({
                success: false,
                message: 'User not authorized.'
            });
        }

        this.repository.getAll(filter).then(users => {

            return this.repository.count().then(count => {
                res.send({ count : count[0].count , content : users});
            }) 
        }).catch( er => res.sendStatus(500))
    }

    private getById(req: Request, res: Response, next: NextFunction) {
        const id = this.getIdFromRequest(req);

        this.repository.getById(id).then(users => {
            if(users && users.length > 0) {
                res.send(users);
            } else {
                res.sendStatus(404);
            }
        }).catch( er => res.sendStatus(500));
    }

    private editUserProfile(req: Request, res: Response, next: NextFunction) {
        const name = req.body.name;
        const website = req.body.website;
        const description = req.body.description;
        const id = this.getLoggedUserId(req);

        this.repository.editProfile(id,name,website,description).then( data => {
            res.sendStatus(201);
        }).catch( er => res.sendStatus(500));
    }

    public init() {
        this.router.get('/',(req: Request, res: Response, next: NextFunction) => this.getAll(req,res,next));
        this.router.get('/:id',(req: Request, res: Response, next: NextFunction) => this.getById(req,res,next));
        this.router.post('/',(req: Request, res: Response, next: NextFunction) => this.editUserProfile(req,res,next));
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

const exportRoutes = new UsersRouter();
exportRoutes.init();

export default exportRoutes.getRouter();