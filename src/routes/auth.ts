// routes/user.ts

import { Context } from "koa";
import { object, string } from "joi";

import * as Auth from "../controllers/auth";

export const signIn = async (ctx: Context) => {
  const {
    value: { email, password },
    error,
  } = object({
    email: string()
      .required()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
    password: string().required(),
  }).validate(ctx.request.body);
  if (error) {
    ctx.status = 400;
    ctx.body = error.message;
    return;
  }

  await Auth.signIn(ctx, email, password);
};

export const signUp = async (ctx: Context) => {
  const {
    value: { email, password, name },
    error,
  } = object({
    email: string()
      .required()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
    password: string().required(),
    name: string().required(),
  }).validate(ctx.request.body);
  if (error) {
    ctx.status = 400;
    ctx.body = error.message;
    return;
  }

  await Auth.signUp(ctx, email, password, name, "user");
};

export const signOut = (ctx: Context) => {
  /**
   * should revoke Token by adding previous token to a black list
   */
  ctx.body = "Sign-out is not yet implemented";
  ctx.status = 200;
};
