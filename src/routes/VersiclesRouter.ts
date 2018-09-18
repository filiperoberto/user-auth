import {Router, Request, Response, NextFunction} from 'express';
import {VersiclesRepository} from '../server/db/queries/VersiclesRepository';
import { TokenChecker } from './TokenChecker';
import { VersiclesFilter } from '../models/VersiclesFilter';

class VersiclesRouter extends TokenChecker {
    private versiclesRepository : VersiclesRepository;

    constructor() {
        super();
        this.versiclesRepository = new VersiclesRepository();
    }

    private getByVersion(req: Request, res: Response, next: NextFunction) {
        const filter = this.getFilter(req) as VersiclesFilter;
        filter.versao = req.params.vrs;

        this.versiclesRepository.getByVersion(filter).then( (versicles : any[]) => {
            res.send(versicles);
        }).catch( er => res.sendStatus(500))
    }

    private getByVersionAndBook(req: Request, res: Response, next: NextFunction) {
        const vrs = req.params.vrs;
        const liv = req.params.liv;

        this.versiclesRepository.getByVersionAndBook(vrs,liv).then( (versicles : any[]) => {
            res.send(versicles);
        }).catch( er => res.sendStatus(500))
    }

    private getByVersionAndBookAndChapter(req: Request, res: Response, next: NextFunction) {
        const vrs = req.params.vrs;
        const liv = req.params.liv;
        const cha = req.params.cha;

        this.versiclesRepository.getByVersionAndBookAndChapter(vrs, liv, cha).then( (versicles : any[]) => {
            res.send(versicles);
        }).catch( er => res.sendStatus(500))
    }

    private getByVersionAndBookAndChapterAndVersicle(req: Request, res: Response, next: NextFunction) {
        const vrs = req.params.vrs;
        const liv = req.params.liv;
        const cha = req.params.cha;
        const ver : string = req.params.ver;

        let versicles = ver.split('-').filter(val => val !== '');
        if(versicles.length >= 2) {

            let verIds = versicles.map( versicle => parseInt(versicle));

            this.versiclesRepository.getByVersionAndBookAndChapterAndVersicles(vrs, liv, cha, [verIds[0], verIds[1]]).then( (versicles : any[]) => {
                res.send(versicles);
            }).catch( er => res.sendStatus(500))
            
        }
        else {
            this.versiclesRepository.getByVersionAndBookAndChapterAndVersicle(vrs, liv, cha, ver).then( (versicles : any[]) => {
                res.send(versicles);
            }).catch( er => res.sendStatus(500))
        }
    }

    public init() {
        this.router.get('/:vrs',(req: Request, res: Response, next: NextFunction) => this.getByVersion(req,res,next));
        this.router.get('/:vrs/:liv',(req: Request, res: Response, next: NextFunction) => this.getByVersionAndBook(req,res,next));
        this.router.get('/:vrs/:liv/:cha',(req: Request, res: Response, next: NextFunction) => this.getByVersionAndBookAndChapter(req,res,next));
        this.router.get('/:vrs/:liv/:cha/:ver',(req: Request, res: Response, next: NextFunction) => this.getByVersionAndBookAndChapterAndVersicle(req,res,next));
    }
    
    protected getIgnoredPaths() : string[] {
        return [];
    }

    protected getIgnoredMethods() : string[] {
        return ['OPTIONS','GET'];
    }

    protected getIgnoredPathAndMethos(): RegExp[] {
        return [];
    }
}

const versiclesRoutes = new VersiclesRouter();
versiclesRoutes.init();

export default versiclesRoutes.getRouter();