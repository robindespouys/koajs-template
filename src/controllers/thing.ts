// controllers/user.ts

import { ThingUtils } from './../utils/thing-utils';
import { Context } from 'koa';

export class ThingController {

  public static async getAllThings(ctx: Context) {
    const result: any = await ThingUtils.getAllThings();
    ctx.body = result.body;
    ctx.status = result.status;
  }

  public static async getThing(ctx: Context) {
    const result: any = await ThingUtils.getThing(ctx.params.id);
    ctx.body = result.body;
    ctx.status = result.status;
  }

  public static async createThing(ctx: Context) {
    const result = await ThingUtils.createThing(ctx.request.body);
    ctx.body = result.body;
    ctx.status = result.status;
  }

  public static async updateThing(ctx: Context) {
    const result = await ThingUtils.updateThing(ctx.params.id, ctx.request.body);
    ctx.body = result.body;
    ctx.status = result.status;
  }

  public static async deleteThing(ctx: Context) {
    const result = await ThingUtils.deleteThing(ctx.params.id);
    ctx.body = result.body;
    ctx.status = result.status;
  }

}
