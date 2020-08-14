// databases/tables-db.ts

/**
 * This file simply imports the models and creates an array with a list of
 * the tables we want to include when we connect to the database.
 */

import { User } from '../models/user';
export const tables = [User];
