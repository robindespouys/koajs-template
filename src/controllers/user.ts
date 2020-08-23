// controllers/user.ts

import { UserUtils } from './../utils/user-utils';
import { Context } from 'koa';

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

  public static async deleteUser(ctx: any) {
    const result = await UserUtils.deleteUser(ctx.params.id);
    ctx.body = result.body;
    ctx.status = result.status;
  }

}
