import {Router, Request, Response, NextFunction} from 'express';
import {VersiclesRepository} from '../server/db/queries/VersiclesRepository';
import * as Knex from 'knex';

class VersiclesRouter {
    router: Router;
    private repository : VersiclesRepository;

    constructor() {
        this.router = Router();
        this.repository = new VersiclesRepository();
        //this.init();
    }

    private getByVersion(req: Request, res: Response, next: NextFunction) {
        const vrs = req.params.vrs;

        this.repository.getByVersion(vrs).then( (versicles : any[]) => {
            res.send(versicles);
        })
    }

    private getByVersionAndBook(req: Request, res: Response, next: NextFunction) {
        const vrs = req.params.vrs;
        const liv = req.params.liv;

        this.repository.getByVersionAndBook(vrs,liv).then( (versicles : any[]) => {
            res.send(versicles);
        })
    }

    private getByVersionAndBookAndChapter(req: Request, res: Response, next: NextFunction) {
        const vrs = req.params.vrs;
        const liv = req.params.liv;
        const cha = req.params.cha;

        this.repository.getByVersionAndBookAndChapter(vrs, liv, cha).then( (versicles : any[]) => {
            res.send(versicles);
        })
    }

    private getByVersionAndBookAndChapterAndVersicle(req: Request, res: Response, next: NextFunction) {
        const vrs = req.params.vrs;
        const liv = req.params.liv;
        const cha = req.params.cha;
        const ver : string = req.params.ver;

        let versicles = ver.split('-').filter(val => val !== '');
        if(versicles.length >= 2) {

            let verIds = versicles.map( versicle => parseInt(versicle));

            this.repository.getByVersionAndBookAndChapterAndVersicles(vrs, liv, cha, [verIds[0], verIds[1]]).then( (versicles : any[]) => {
                res.send(versicles);
            })
            
        }
        else {
            this.repository.getByVersionAndBookAndChapterAndVersicle(vrs, liv, cha, ver).then( (versicles : any[]) => {
                res.send(versicles);
            })
        }
    }

    public init() {
        this.router.get('/:vrs',(req: Request, res: Response, next: NextFunction) => this.getByVersion(req,res,next));
        this.router.get('/:vrs/:liv',(req: Request, res: Response, next: NextFunction) => this.getByVersionAndBook(req,res,next));
        this.router.get('/:vrs/:liv/:cha',(req: Request, res: Response, next: NextFunction) => this.getByVersionAndBookAndChapter(req,res,next));
        this.router.get('/:vrs/:liv/:cha/:ver',(req: Request, res: Response, next: NextFunction) => this.getByVersionAndBookAndChapterAndVersicle(req,res,next));
    }
}

const versiclesRoutes = new VersiclesRouter();
versiclesRoutes.init();

export default versiclesRoutes.router;