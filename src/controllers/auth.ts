import { hash, verify } from "argon2";
import { randomBytes } from "crypto";
import jwt from "jsonwebtoken";
import { Context } from "koa";
import { getManager } from "typeorm";

import { User } from "../models/user";
import { createUser } from "./user";

export const signUp = async (
  ctx: Context,
  email: string,
  password: string,
  name: string,
  role: string
): Promise<void> => {
  const salt = randomBytes(32);
  const hashedPassword = await hash(password, { salt });
  try {
    const userCreation = await createUser({
      name,
      hashedPassword: hashedPassword,
      email,
      salt: salt.toString("hex"),
      role,
    });

    ctx.body = {
      user: {
        email: userCreation.email,
        name: userCreation.name,
        role: userCreation.role,
        id: userCreation.id,
      },
      token: generateJWT(userCreation),
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = error.message;
  }
};

export const signIn = async (
  ctx: Context,
  email: string,
  password: string
): Promise<void> => {
  const userRecord: User = await getManager()
    .getRepository(User)
    .findOne({ email });
  if (!userRecord) {
    ctx.status = 404;
    ctx.body = "This user does not exist";
    return;
  }

  const correctPassword = await verify(
    userRecord.getHashedPassword(),
    password
  );
  if (!correctPassword) {
    ctx.status = 401;
    ctx.body = "Incorrect password";
    return;
  }
  ctx.body = {
    user: {
      email: userRecord.email,
      name: userRecord.name,
      role: userRecord.role,
      id: userRecord.id,
    },
    token: generateJWT(userRecord),
  };
};

const generateJWT = (user: User): string => {
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
    process.env.JWT_SECRET
  );
};
