// databases/create-connections-db.ts

/**
 * This file initializes the connections to the db(s)
 */

import { createConnection } from "typeorm";
import { tables } from "./tables-db";
import fs = require("fs");

export const postgresDB = async () => {
  return await createConnection({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl:
      process.env.DB_SSL_CA_PATH === ""
        ? false
        : {
            ca: fs.readFileSync(process.env.DB_SSL_CA_PATH).toString(),
          },
    entities: tables,
    logging:
      process.env.ACTIVATE_LOG_QUERIES === "true"
        ? ["query", "error"]
        : ["error"],
    synchronize: true,
  })
    .then(_connection => {
      console.log(`Connected to ${process.env.NODE_ENV} Database !`);
      return _connection;
    })
    .catch((error: any) => {
      console.error(error);
    });
};
