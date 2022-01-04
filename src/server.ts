// server.ts

import Koa from "koa";
import bodyParser from "koa-bodyparser";
import path from "path";
import dotenv from "dotenv";
import { Server } from "http";
import { Connection } from "typeorm";

import { postgresDB } from "./databases/create-connections-db";
import isAuth from "./middlewares/isAuth";
import restRouter from "./routes";

interface Context {
  dbConnection: Connection;
  app: Server;
}

dotenv.config({
  path: path.resolve(__dirname, `../config/${process.env.ENVIRONMENT}.env`),
});
console.info(`${process.env.ENVIRONMENT} MODE`);

const portNumber = Number(process.env.PORT) || 3333;

export const startServer: () => Promise<Context> = async () => {
  const dbConnection = await postgresDB();

  const myApp = new Koa()
    .use(bodyParser())
    .use(isAuth)
    .use(restRouter.routes());

  const app = myApp.listen(portNumber);
  console.info(`listening on port ${portNumber}`);

  return {
    dbConnection,
    app,
  };
};

if (process.env.ENVIRONMENT !== "test") startServer();
