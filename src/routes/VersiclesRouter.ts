import { Request, Response, NextFunction} from 'express';
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

        this.doGet(filter, res);
    }

    private doGet(filter: VersiclesFilter, res: Response) {
        this.versiclesRepository.getByVersion(filter).then((versicles: any[]) => {

            if(versicles.length === 0) {
                res.sendStatus(404);
            } else {
                return this.versiclesRepository.count(filter).then(count => {
                    res.send({count : count[0].count, content : versicles});
                })
            }

        }).catch(er => res.status(500).send(er));
    }

    private getByVersionAndBook(req: Request, res: Response, next: NextFunction) {
        const filter = this.getFilter(req) as VersiclesFilter;
        filter.versao = req.params.vrs;
        filter.livro = req.params.liv;

        this.doGet(filter, res);
    }

    private getByVersionAndBookAndChapter(req: Request, res: Response, next: NextFunction) {
        const filter = this.getFilter(req) as VersiclesFilter;
        filter.versao = req.params.vrs;
        filter.livro = req.params.liv;
        filter.capitulo = req.params.cha;

        this.doGet(filter, res);
    }

    private getByVersionAndBookAndChapterAndVersicle(req: Request, res: Response, next: NextFunction) {
        const filter = this.getFilter(req) as VersiclesFilter;
        filter.versao = req.params.vrs;
        filter.livro = req.params.liv;
        filter.capitulo = req.params.cha;
        const ver : string = req.params.ver;

        let versicles = ver.split('-').filter(val => val !== '');
        if(versicles.length >= 2) {

            let verIds = versicles.map( versicle => parseInt(versicle));
            filter.versiculos = [verIds[0], verIds[1]];
        }
        else {
            filter.versiculo = parseInt(ver);
        }
        this.doGet(filter, res);
    }

    private listBooks(req: Request, res: Response) {
        this.versiclesRepository
            .listBooks()
            .then(books => res.send(books))
            .catch(er => res.status(500).send(er));
    }

    private listChapters(req: Request, res: Response) {

        const filter = this.getFilter(req) as VersiclesFilter;
        filter.versao = req.params.vrs;
        filter.livro = req.params.liv;

        this.versiclesRepository
            .listChapters(filter)
            .then(books => res.send(books))
            .catch(er => res.status(500).send(er));
    }

    private listVersicles(req: Request, res: Response) {

        const filter = this.getFilter(req) as VersiclesFilter;
        filter.versao = req.params.vrs;
        filter.livro = req.params.liv;
        filter.capitulo = req.params.cha;

        this.versiclesRepository
            .listVersicles(filter)
            .then(books => res.send(books))
            .catch(er => res.status(500).send(er));
    }

    public init() {
        this.router.get('/:vrs(ara|nvi|arc)',(req: Request, res: Response, next: NextFunction) => this.getByVersion(req,res,next));
        this.router.get('/:vrs(ara|nvi|arc)/:liv',(req: Request, res: Response, next: NextFunction) => this.getByVersionAndBook(req,res,next));
        this.router.get('/:vrs(ara|nvi|arc)/:liv/:cha',(req: Request, res: Response, next: NextFunction) => this.getByVersionAndBookAndChapter(req,res,next));
        this.router.get('/:vrs(ara|nvi|arc)/:liv/:cha/:ver',(req: Request, res: Response, next: NextFunction) => this.getByVersionAndBookAndChapterAndVersicle(req,res,next));
        this.router.get('/books',(req: Request, res: Response) => this.listBooks(req,res));
        this.router.get('/chapters/:vrs/:liv',(req: Request, res: Response) => this.listChapters(req,res));
        this.router.get('/versicles/:vrs/:liv/:cha',(req: Request, res: Response) => this.listVersicles(req,res));
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