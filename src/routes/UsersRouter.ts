import {TokenChecker} from './TokenChecker';
import {Router, Request, Response, NextFunction} from 'express';

class UsersRouter extends TokenChecker {

    constructor() {
        super();
    }

    private getAll(req: Request, res: Response, next: NextFunction) {
        this.repository.getAll().then(users => {
            res.send(users);
        })
    }

    public init() {
        this.router.get('/',(req: Request, res: Response, next: NextFunction) => this.getAll(req,res,next));
    }

    protected getIgnoredPaths() : string[] {
        return [];
    }

    protected getIgnoredMethods() : string[] {
        return [];
    }

}

const exportRoutes = new UsersRouter();
exportRoutes.init();

export default exportRoutes.getRouter();