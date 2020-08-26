// controllers/user.ts

import { Context } from "koa";
import { UserUtils } from "./../utils/user-utils";

export class UserController {
  public static async getAllUsers(ctx: Context) {
    const result: any = await UserUtils.getAllUsers();
    ctx.body = result.body;
    ctx.status = result.status;
  }

  public static async getUser(ctx: Context) {
    const result: any = await UserUtils.getUser(ctx.params.id);
    ctx.body = result.body;
    ctx.status = result.status;
  }

  public static async updateUser(ctx: any) {
    const result = await UserUtils.updateUser(ctx.params.id, ctx.request.body);
    ctx.body = result.body;
    ctx.status = result.status;
  }
}
