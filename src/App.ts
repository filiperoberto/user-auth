import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import VersionsRouter from './routes/VersionsRouter';
import VersiclesRouter from './routes/VersiclesRouter';
import UsersRouter from './routes/UsersRouter';
import AuthRouter from './routes/AuthRouter';
import TagsRouter from './routes/TagsRouter';
import PeopleRouter from './routes/PeopleRouter';
import PostsRouter from './routes/PostsRouter';
import CommentsRouter from './routes/CommentsRouter';
import SystemRouter from './routes/SystemRouter';

// Creates and configures an ExpressJS web server.
class App {

  // ref to Express instance
  public express: express.Application;

  //Run configuration methods on the Express instance.
  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
  }

  // Configure Express middleware.
  private middleware(): void {
    this.express.use(logger('dev'));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
  }

  // Configure API endpoints.
  private routes(): void {
    /* This is just to get up and running, and to make sure what we've got is
     * working so far. This function will change when we start to add more
     * API endpoints */
    let router = express.Router();
    // placeholder route handler
    router.get('/', (req, res, next) => {
      res.json({
        message: 'Hello World!'
      });
    });

    this.express.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-access-token");

      next();
    });
    
    this.express.use('/', router);
    this.express.use('/api/v1/versions', VersionsRouter);
    this.express.use('/api/v1/versicles', VersiclesRouter);
    this.express.use('/api/v1/users', UsersRouter);
    this.express.use('/api/v1/auth', AuthRouter);
    this.express.use('/api/v1/tags', TagsRouter);
    this.express.use('/api/v1/people', PeopleRouter);
    this.express.use('/api/v1/posts', PostsRouter);
    this.express.use('/api/v1/comments', CommentsRouter);
    this.express.use('/api/v1/system', SystemRouter);
  }
}

export default new App().express;