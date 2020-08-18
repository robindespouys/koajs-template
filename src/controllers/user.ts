// controllers/user.ts

import { BaseContext } from 'koa';
import { UserUtils } from './../utils/user-utils';

export class UserController {

    public static async getAllUsers(ctx: BaseContext) {
        const result: any = await UserUtils.getAllUsers();
        ctx.body = result.body;
        ctx.status = result.status;
    }

    public static async getUser(ctx: BaseContext) {
        const result: any = await UserUtils.getUser(ctx.params.id);
        ctx.body = result.body;
        ctx.status = result.status;
    }

    public static async createUser(ctx: BaseContext) {
        const result = await UserUtils.createUser(ctx.request.body);
        ctx.body = result.body;
        ctx.status = result.status;
    }

    public static async updateUser(ctx: BaseContext) {
        const result = await UserUtils.updateUser(ctx.params.id, ctx.request.body);
        ctx.body = result.body;
        ctx.status = result.status;
    }

    public static async deleteUser(ctx: BaseContext) {
        const result = await UserUtils.deleteUser(ctx.params.id);
        ctx.body = result.body;
        ctx.status = result.status;
    }

}
