import 'module-alias/register';
import 'reflect-metadata';
import http from 'http';
import { App } from './server/app';
import { Log } from './common/services/log';
import dotenv from 'dotenv';

dotenv.config();

const start = async () => {
  try {
    const app = new App();
    const appServer = app.getServer().build();

    // connect to DB
    await app.connectDB();
    Log.info('📦  PostgresDB Connected!');

    // start server
    const httpServer = http.createServer(appServer);
    const PORT = process.env.PORT || 8080
    httpServer.listen(PORT);
    httpServer.on('listening', () => Log.info(`🚀  ${process.env.SERVICE_NAME} listening on ` + PORT));
  } catch (err) {
    Log.error(err, 'Fatal server error');
  }
};

start();
