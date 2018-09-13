import {TokenChecker} from './TokenChecker';
import {Request, Response, NextFunction} from 'express';
const pjson = require('../../package.json');

export class SystemRouter extends TokenChecker {


    constructor() {
        super();
    }

    private getVersion(req: Request, res: Response, next: NextFunction) {
        res.send({version : pjson.version});

    }

    public init() {
        this.router.get('/version',(req: Request, res: Response, next: NextFunction) => this.getVersion(req,res,next));
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


const exportRoutes = new SystemRouter();
exportRoutes.init();

export default exportRoutes.getRouter();
