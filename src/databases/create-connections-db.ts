// databases/create-connections-db.ts

/**
 * This file initializes the connections to the db(s)
 */

import { createConnection } from 'typeorm';
import { tables } from './tables-db';
import fs = require('fs');
import { LoggerOptions } from 'typeorm/logger/LoggerOptions';

export const postgresDB = async () => {
    const logging: LoggerOptions = [];
    if (process.env.ACTIVATE_LOG_QUERIES === 'true') {
      logging.push("query");
    }
    if (process.env.ACTIVATE_LOG_ERRORS === 'true') {
      logging.push("error");
    }

    return await createConnection({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        ssl: process.env.DB_SSL_CA_PATH === '' ? false : {
            ca: fs.readFileSync(process.env.DB_SSL_CA_PATH).toString(),
        },
        entities: tables,
        logging,
        synchronize: true,
    }).then(_connection => {
        console.log(`Connected to ${process.env.NODE_ENV} Database !`);
        return _connection;
    }).catch((error: any) => {
        console.error(error);
    });
};
