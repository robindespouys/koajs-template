// server.ts

import { postgresDB } from './databases/create-connections-db';
import { restRouter } from './routes/rest-routes';
import * as bodyParser from 'koa-bodyparser';
import * as Koa from 'koa';
import path = require('path');
import dotenv = require('dotenv');
import isAuth from './middlewares/isAuth';

dotenv.config({ path: path.resolve(__dirname, `../config/${process.env.ENVIRONMENT}.env`) });

export class Server {
  public static async startServer(): Promise<any> {
    let dbConnection: any;
    const myApp = new Koa();
    dbConnection = await postgresDB();
    console.log(`${process.env.NODE_ENV} MODE`);

    /**
     * Enable bodyParser for easier body parsing. you can still have fun with ctx.req
     * if you don't want to use this library
     */
    myApp.use(bodyParser());

    myApp.use(isAuth);
    /** Tell our application to use the router we created */
    myApp.use(restRouter.routes());

    const portNumber = Number(process.env.PORT) || 3333;
    console.log(`listening on port ${portNumber}`);

    return {
      connection: dbConnection,
      app: myApp.listen(portNumber),
    };
  }
}

if (process.env.NODE_ENV !== 'test') Server.startServer();
