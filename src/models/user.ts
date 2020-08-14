// models/user.ts

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

/**
 * Import functions from the class-valadiator package in order
 * to validate input data when creating or editing a user
 */
import { Length, IsEmail } from 'class-validator';

/**
 * This decorator : @, specify the name of the table
 */
@Entity('users')

/**
 * Export the User class so we can use it elsewhere in our project
 */
export class User {

    @PrimaryGeneratedColumn('uuid')     // Tells Postgres to generate a Unique Key for this column
    public id: string;                         // Name of the column is id and type is string

    @Column('text')
    public name: string;

    @Column('text')
    @Length(5, 100)
    @IsEmail()
    public email: string;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;
}
