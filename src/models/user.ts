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

  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column('text')
  public name: string;

  @Column('text')
  @Length(5, 100)
  @IsEmail()
  public email: string;

  @Column('text')
  public role: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @Column('text')
  private hashedPassword: string;

  @Column('text')
  private salt: string;

  public getHashedPassword(): string {
    return this.hashedPassword;
  }

  public getSalt(): string {
    return this.salt;
  }

  public setHashedPassword(hashedPassword: string) {
    this.hashedPassword = hashedPassword;
  }

  public setSalt(salt: string) {
    this.salt = salt;
  }
}
