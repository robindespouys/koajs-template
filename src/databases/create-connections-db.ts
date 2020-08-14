// databases/create-connections-db.ts

/**
 * This file initializes the connections to the db(s)
 */

import { createConnection } from 'typeorm';
import { tables } from './tables-db';

export const postgresDBDev = async () => {

    return await createConnection({
        type: 'postgres',
        host: '127.0.0.1',
        port: 5432,
        username: 'postgresuser',
        password: 'postgrespassword',
        database: 'awesome-db-name-dev',
        ssl: false,
        entities: tables,
        logging: ['query', 'error'],
        synchronize: true,
    }).then(_connection => {
        console.log('Connected to Development Database !');
        return _connection;
    }).catch((error: any) => {
        console.error(error);
    });
};

export const postgresDBProd = async () => {

    return await createConnection({
        type: 'postgres',
        host: '127.0.0.1',
        port: 5432,
        username: 'postgresuser',
        password: 'postgrespassword',
        database: 'awesome-db-name-prod',
        ssl: false,
        entities: tables,
        logging: ['query', 'error'],
        synchronize: true,
    }).then(_connection => {
        console.log('Connected to Production Database !');
        return _connection;
    }).catch((error: any) => {
        console.error(error);
    });
};
