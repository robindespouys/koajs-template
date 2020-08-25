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
import { Length, IsEmail, IsString } from 'class-validator';

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
  @IsString()
  public name: string;

  @Column('text')
  @Length(5, 100)
  @IsEmail()
  public email: string;

  @Column('text')
  @IsString()
  public role: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @Column('text')
  @IsString()
  public salt: string;

  @Column('text')
  @IsString()
  private hashedPassword: string;

  public getHashedPassword(): string {
    return this.hashedPassword;
  }

  public setHashedPassword(hashedPassword: string) {
    this.hashedPassword = hashedPassword;
  }

}
