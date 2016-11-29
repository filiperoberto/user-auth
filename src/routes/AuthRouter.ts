import {Router, Request, Response, NextFunction} from 'express';
import {UsersRepository} from '../server/db/queries/UsersRepository';
import * as Knex from 'knex';

class AuthRouter {
    router: Router;
    private repository : UsersRepository;

    constructor() {
        this.router = Router();
        this.repository = new UsersRepository();
    }

    private authenticate(req: Request, res: Response, next: NextFunction) {
        const username = req.body.username;
        const password = req.body.password;
        
        this.repository.getUserByUsernameAndPassword(username, password).then( (user : any[]) => {
            if(user.length > 0) {
                res.sendStatus(200);
            } else {
                res.sendStatus(404);
            }
        }) 
        
    }

    public init() {
        this.router.post('/login',(req: Request, res: Response, next: NextFunction) => this.authenticate(req,res,next));
    }

}


const exportRoutes = new AuthRouter();
exportRoutes.init();

export default exportRoutes.router;