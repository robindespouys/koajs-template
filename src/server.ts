// server.ts

import { postgresDBDev, postgresDBProd } from './databases/create-connections-db';
import { restRouter } from './routes/rest-routes';
import * as bodyParser from 'koa-bodyparser';
import * as Koa from 'koa';
import { exit } from 'process';

export default class Server {
    public static async startServer(): Promise<any> {
        let dbConnection: any;
        const myApp = new Koa();
        switch (process.env.NODE_ENV || 'development') {
            case 'development': {
                dbConnection = await postgresDBDev();
                console.log("DEVELOPMENT MODE");
                break;
            }
            case 'production': {
                dbConnection = await postgresDBProd();
                console.log("PRODUCTION MODE");
                break;
            }
            default: {
                console.log("UNKNOWN MODE");
                exit(1);
            }
        }

        /**
         * Enable bodyParser for easier body parsing. you can still have fun with ctx.req
         * if you don't want to use this library
         */
        myApp.use(bodyParser());

        /** Tell our application to use the router we created */
        myApp.use(restRouter.routes(), restRouter.allowedMethods());

        const portNumber = Number(process.env.PORT) || 3333;
        console.log(`listening on port ${portNumber}`);

        return {
            connection : dbConnection,
            app : myApp.listen(portNumber),
        };
    }
}

if (process.env.NODE_ENV !== 'test') Server.startServer();
