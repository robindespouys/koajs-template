// routes/user.ts

import { object, string } from "joi";
import { Context } from "koa";

import * as UserController from "../controllers/user";

export const getAllUsers = async (ctx: Context) => {
  await UserController.getAllUsers(ctx);
};

export const getUser = async (ctx: Context) => {
  const {
    value: { id },
    error,
  } = object({ id: string().required() }).validate(ctx.query.params);
  if (error) {
    ctx.status = 400;
    ctx.body = error.message;
  }

  await UserController.getUser(ctx, id);
};

export const updateUser = async (ctx: Context) => {
  const params = object({ id: string().required() }).validate(ctx.query.params);
  const body = object({}).validate(ctx.body);
  if (params.error) {
    ctx.status = 400;
    ctx.body = params.error.message;
  } else if (body.error) {
    ctx.status = 400;
    ctx.body = body.error.message;
  }

  await UserController.updateUser(ctx, params.value.id, body.value);
};
