import 'module-alias/register';
import 'reflect-metadata';
import responseTime from 'response-time';
import { getRouteInfo, InversifyExpressServer } from 'inversify-express-utils';
import container from '../common/config/ioc';
import express, { Application, Request, Response, Express } from 'express';
import { config } from 'dotenv';
import { cloudinaryConfig } from '@app/common/services/cloudinary';
import cors from 'cors';
import { Store } from '@app/common/services';
import { errors } from '@app/data/util';
import db from '@app/data/database/connect';

config();

export class App {
  app: Express = express();
  private server: InversifyExpressServer;
  constructor() {
    this.server = new InversifyExpressServer(container, null, {
      rootPath: process.env.API_VERSION,
    });

    // setup server-level middlewares
    this.server.setConfig((app: Application) => {
      app.enabled('x-powered-by');

      app.use(responseTime());
      app.use(express.urlencoded({ extended: true }));
      app.use(express.json());
      // Handle image upload
      app.use('*', cloudinaryConfig);

      // CORS
      const domains = [''];
      const corsConf = {
        origin: [/localhost/, ...domains.map((domain) => new RegExp(`${domain}$`))],
        credentials: true,
      };

      app.use(cors(corsConf));
      app.options('*', cors(corsConf));
    });

    this.server.setErrorConfig((app: Application) => {
      // expose index endpoint
      app.get('/', (_req: Request, res: Response) => {
        res.status(200).json({
          status: 'success',
          data: { message: 'Welcome To Home FarmLend' },
        });
      });

      // register 404 route handler
      app.use((_req, res, _next) => {
        res.status(404).json({
          status: 'error',
          data: { message: 'Not Found' },
        });
      });

      // handle thrown error
      app.use(errors);
    });
  }

  printRoutes() {
    const routeInfo = getRouteInfo(container);
    console.log(JSON.stringify(routeInfo));
  }

  getServer = () => this.server;

  async connectDB() {
    // await Store.connect();
    await db.sequelize.authenticate();
  }

  /**
   * Closes DB and Redis connection
   */
  async closeDB() {
    await db.sequelize.close();
    await Store.quit();
  }
}
