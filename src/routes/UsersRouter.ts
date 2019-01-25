import {TokenChecker} from './TokenChecker';
import {Router, Request, Response, NextFunction} from 'express';

class UsersRouter extends TokenChecker {

    constructor() {
        super();
    }

    private getAll(req: Request, res: Response, next: NextFunction) {

        let filter = this.getFilter(req);

        if(!req.query.limit) {
            filter.limit = 1000;
        }

        this.repository.getAll(filter).then(users => {
            res.send(users);
        }).catch( er => res.sendStatus(500))
    }

    private getById(req: Request, res: Response, next: NextFunction) {
        const originalId = req.params.id;
        const id = this.getIdFromRequest(req);
        const logged = this.getLoggedUserId(req);

        this.repository.getById(id).then((users : any[]) => {
            if(users && users.length > 0) {
                if(originalId !== 'me') {
                    delete users[0].email;
                }

                res.send(users[0]);
            } else {
                res.sendStatus(404);
            }
        }).catch( er => res.sendStatus(500));
    }

    private editUserProfile(req: Request, res: Response, next: NextFunction) {

        let user = {
            name : req.body.name,
            website : req.body.website,
            description : req.body.description,
            latitude : req.body.latitude,
            longitude : req.body.longitude,
            email : req.body.email,
            contact : req.body.contact,
            birth : req.body.birth,
            hidden : req.body.hidden,
            notifications_enabled : req.body.notifications_enabled,
            hidden_age : req.body.hidden_age
        }

        const id = this.getLoggedUserId(req);

        this.repository.editProfile(id, user).then( data => {
            res.sendStatus(201);
        }).catch( er => res.sendStatus(500));
    }

    private getReputation(req: Request, res: Response, next: NextFunction) {
        let id = req.params.id;

        if(id === 'me') {
            id = this.getLoggedUserId(req);
        }

        this.repository.getReputation(id).then((users : any[]) => {
            if(users.length > 0) {
                res.json({reputation : users[0].reputation});
            } else {
                res.sendStatus(404);
            }
        }).catch( er => res.sendStatus(500))
    }

    public init() {
        this.router.get('/',(req: Request, res: Response, next: NextFunction) => this.getAll(req,res,next));
        this.router.get('/:id',(req: Request, res: Response, next: NextFunction) => this.getById(req,res,next));
        this.router.put('/:id',(req: Request, res: Response, next: NextFunction) => this.editUserProfile(req,res,next));
        this.router.get('/reputation/:id',(req: Request, res: Response, next: NextFunction) => this.getReputation(req,res,next));
    }

    protected getIgnoredPaths() : string[] {
        return [];
    }

    protected getIgnoredMethods() : string[] {
        return ['OPTIONS'];
    }

    protected getIgnoredPathAndMethos() : RegExp[] {
        return []
    }


}

const exportRoutes = new UsersRouter();
exportRoutes.init();

export default exportRoutes.getRouter();