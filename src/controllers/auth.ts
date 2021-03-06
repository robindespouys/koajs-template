// controllers/user.ts

import { Context } from "koa";
import { AuthUtils } from "./../utils/auth-utils";
import { Utils } from "./../utils/generic-utils";

export class AuthController {
  public static async signIn(ctx: Context) {
    const checkFields: any = Utils.checkFields(
      ["email", "password"],
      ctx.request.body
    );
    if (checkFields.status === 400) {
      ctx.body = checkFields.body;
      ctx.status = checkFields.status;
      return;
    }
    const result = await AuthUtils.signIn(
      ctx.request.body.email,
      ctx.request.body.password
    );
    ctx.body = result.body;
    ctx.status = result.status;
  }

  public static async signUp(ctx: Context) {
    const checkFields: any = Utils.checkFields(
      ["email", "password", "name"],
      ctx.request.body
    );
    if (checkFields.status === 400) {
      ctx.body = checkFields.body;
      ctx.status = checkFields.status;
      return;
    }
    const result = await AuthUtils.signUp(
      ctx.request.body.email,
      ctx.request.body.password,
      ctx.request.body.name,
      "user"
    );
    ctx.body = result.body;
    ctx.status = result.status;
  }

  public static async signOut(ctx: Context) {
    /**
     * should revoke Token by adding previous token to a black list
     */
    ctx.body = "Sign-out is not yet implemented";
    ctx.status = 200;
  }
}
