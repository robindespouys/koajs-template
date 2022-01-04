// controllers/user.ts

import { Context } from "koa";

import * as ThingController from "../controllers/thing";

export const getAllThings = async (ctx: Context) => {
  const result: any = await ThingController.getAllThings();
  ctx.body = result.body;
  ctx.status = result.status;
};

export const getThing = async (ctx: Context) => {
  const result: any = await ThingController.getThing(ctx.params.id);
  ctx.body = result.body;
  ctx.status = result.status;
};

export const createThing = async (ctx: Context) => {
  const result = await ThingController.createThing(ctx.body);
  ctx.body = result.body;
  ctx.status = result.status;
};

export const updateThing = async (ctx: Context) => {
  const result = await ThingController.updateThing(ctx.params.id, ctx.body);
  ctx.body = result.body;
  ctx.status = result.status;
};

export const deleteThing = async (ctx: Context) => {
  const result = await ThingController.deleteThing(ctx.params.id);
  ctx.body = result.body;
  ctx.status = result.status;
};
