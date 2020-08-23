import { getManager } from "typeorm";
import { User } from "./../models/user";
import * as jwt from 'jsonwebtoken';
import * as argon2 from 'argon2';
import { randomBytes } from "crypto";
import { UserUtils } from './user-utils';

export class AuthUtils {

  public static async signUp(email: string, password: string, name: string, role: string): Promise<any> {
    const salt = randomBytes(32);
    const hashedPassword = await argon2.hash(password, { salt });
    const userCreation = await UserUtils.createUser({
      name,
      hashedPassword,
      email,
      salt: salt.toString('hex'),
      role,
    });
    if (userCreation.status !== 201) {
      return userCreation;
    }
    const userRecord = userCreation.body;
    return {
      body: {
        user: {
          email: userRecord.email,
          name: userRecord.name,
        },
        token: this.generateJWT(userRecord),
      },
      status: userCreation.status,
    };
  }

  public static async signIn(email: string, password: string): Promise<any> {
    const userRecord: User = await getManager().getRepository(User).findOne(email);
    if (!userRecord) {
      return {
        status: 404,
        body: 'This user does not exist',
      };
    } else {
      const correctPassword = await argon2.verify(userRecord.getHashedPassword(), password);
      if (!correctPassword) {
        return {
          status: 401,
          body: 'Incorrect password',
        };
      }
    }
    return {
      body: {
        user: {
          email: userRecord.email,
          name: userRecord.name,
        },
        token: this.generateJWT(userRecord),
      },
      status: 200,
    };
  }

  private static generateJWT(user: User) {
    const today = new Date();
    const expiration = new Date(today);
    expiration.setDate(today.getDate() + 7);
    return jwt.sign(
      {
        id: user.id,
        role: user.role,
        name: user.name,
        exp: expiration.getTime() / 1000,
      },
      process.env.JWT_SECRET,
    );
  }
}