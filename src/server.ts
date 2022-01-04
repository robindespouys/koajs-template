// server.ts

import Koa from "koa";
import bodyParser from "koa-bodyparser";
import path from "path";
import dotenv from "dotenv";

import { postgresDB } from "./databases/create-connections-db";
import isAuth from "./middlewares/isAuth";
import { restRouter } from "./routes/rest-routes";

dotenv.config({
  path: path.resolve(__dirname, `../config/${process.env.ENVIRONMENT}.env`),
});

export class Server {
  public static async startServer(): Promise<any> {
    const myApp = new Koa();
    const dbConnection = await postgresDB();
    console.log(`${process.env.ENVIRONMENT} MODE`);

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
      dbConnection,
      app: myApp.listen(portNumber),
    };
  }
}

if (process.env.ENVIRONMENT !== "test") Server.startServer();
