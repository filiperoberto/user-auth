import {Request, Response, NextFunction} from 'express';
import {TokenChecker} from './TokenChecker';
import {MailSender} from '../util/MailSender';

const config = require('../config');
const jwt = require('jsonwebtoken');

class AuthRouter extends TokenChecker {

    constructor() {
        super();
    }

    private authenticate(req: Request, res: Response, next: NextFunction) {
        const username = req.body.username;
        const password = req.body.password;
        
        this.repository.getUserByUsernameAndPassword(username, password).then( (user : any[]) => {
            if(user.length > 0) {

                let token = this.getToken(user[0]);

                res.status(200);
                res.json({ token : token});
            } else {
                res.status(401);
                res.json({});
            }
        }).catch( er => res.json(er).status(500));
    }

    private register(req: Request, res: Response, next: NextFunction) {
        const username = req.body.username;
        const password = req.body.password;
        const repeat = req.body.repeat;
        const name = req.body.name;

        const lat = req.body.latitude;
        const lng = req.body.longitude;

        if(repeat !== password) {
            res.status(400);
            return res.json({ message : 'passwords_not_equal' });
        }

        this.repository.register(name, username, password, lat, lng).then( (id : number) => {

            this.repository.getById(id).then( user => {

                let token = this.getToken(user[0]);

                res.status(201);
                res.json({ token : token});
            })
        }).catch( er => {
            if(er.sqlState == '23000') {
                res.status(400);
                res.json({ message : 'username_unique_violation' });
            }
            else {
                res.sendStatus(500);
            }
            console.error(er);
        })
    }

    private changePassword(req: Request, res: Response, next: NextFunction) {
        const password = req.body.password;
        const id = this.getLoggedUserId(req);

        this.repository.changePassword(id, password)
            .then( data => res.sendStatus(201))
            .catch( er => res.sendStatus(500))
    }

    private forgotPassword(req: Request, res: Response, next: NextFunction) {
        const username = req.body.username;
        let random = this.getRandomNumber();
        let user = {
            username : username,
            random : random
        }
        this.repository.setRandomNumber(username, random)
            .then(() => {

                return this.repository.getUserEmailByUsername(username).then(userEmail => {

                    if(userEmail.length > 0) {

                        let email = userEmail[0].email;

                        let token = this.getToken(user);

                        MailSender.sendPassRecoveryEmail(email, token).then(() => {
                            res.json({ email : email});
                        }).catch(er => {
                            console.error(er);
                            res.sendStatus(500)
                        });

                    } else {
                        res.status(401);
                        res.json({});
                    }
                }).catch( er => res.sendStatus(500));
            })
            .catch( er => res.sendStatus(500));
    }

    private resetPassword(req: Request, res: Response, next: NextFunction) {
        let username = req['decoded']['username'];
        let random = req['decoded']['random'];

        let password = req.body.password;
        let repeat = req.body.repeat;

        if(this.isValidPassword(repeat,password)) {

            console.log(username);
            
            this.repository.resetPassword(username, random, password).then((result : number) => {
                if(result === 1) {
                    MailSender.sendPasswordResetConfirm(username).then(()=>{}).catch(er => {
                        console.error(`Error sending email to ${username}`);
                    })
                    res.sendStatus(200);
                }
                else {
                    res.sendStatus(401);
                }
            }).catch(er => {
                console.error(er);
                res.sendStatus(500);
            })
        } else {
            res.sendStatus(400);
        }
    }

    private ping(req: Request, res: Response, next: NextFunction) {
        let id = this.getLoggedUserId(req);
        res.status(200);
        res.json({ id : id });
    }

    private isValidPassword(repeat: string, password : string) : boolean {
        return repeat === password && password !== '' && password !== undefined;
    }

    private getRandomNumber() : number {
        return Math.floor((Math.random() * 1000000) + 1);
    }

    private checkResetToken(req: Request, res: Response, next: NextFunction) {
        let username = req['decoded']['username'];
        let random = req['decoded']['random'];

        this.repository.getUserByUsernameAndRandom(username, random).then((users : any[]) => {
            if(users.length > 0) {
                res.sendStatus(200);
            } else {
                res.sendStatus(404);
            }
        })
    }

    public init() {
        this.router.post('/login',(req: Request, res: Response, next: NextFunction) => this.authenticate(req,res,next));
        this.router.post('/register',(req: Request, res: Response, next: NextFunction) => this.register(req,res,next));
        this.router.post('/password',(req: Request, res: Response, next: NextFunction) => this.changePassword(req,res,next));
        this.router.post('/forgot',(req: Request, res: Response, next: NextFunction) => this.forgotPassword(req,res,next));
        this.router.post('/reset',(req: Request, res: Response, next: NextFunction) => this.resetPassword(req,res,next));
        this.router.get('/ping',(req: Request, res: Response, next: NextFunction) => this.ping(req,res,next));
        this.router.get('/reset',(req: Request, res: Response, next: NextFunction) => this.checkResetToken(req,res,next));
    }

    private getToken(user) : string {
        let secret = config.secret;
        return jwt.sign(user, secret, {
          expiresIn: '1d'
        });
    }

    protected getIgnoredPaths() : string[] {
        return ['/login','/forgot'];
    }

    protected getIgnoredMethods() : string[] {
        return ['OPTIONS'];
    }

    protected getIgnoredPathAndMethos() : RegExp[] {
        return []
    }

}

const exportRoutes = new AuthRouter();
exportRoutes.init();

export default exportRoutes.getRouter();