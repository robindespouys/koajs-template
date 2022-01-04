import { JwtPayload, verify } from "jsonwebtoken";
import { Context } from "koa";

import { UserUtils } from "./../utils/user-utils";

const isAuth = async (ctx: Context, next: () => Promise<any>) => {
  try {
    if (ctx.path.includes("auth/signin") || ctx.path.includes("auth/signup")) {
      return next();
    }
    let loginToken: any = null;
    if (ctx.req.headers.authorization) {
      loginToken = ctx.req.headers.authorization.split(" ")[1];
    }

    let payload: JwtPayload;
    try {
      payload = verify(loginToken, process.env.JWT_SECRET) as JwtPayload;
    } catch (error) {
      ctx.body = error.message;
      ctx.status = 401;
    }

    if (payload) {
      const userId = payload.id;
      const getUser: any = await UserUtils.getUser(userId);
      if (getUser.status !== 200) {
        ctx.body = getUser.body;
        ctx.status = getUser.status;
      } else {
        ctx.request.body.currentUser = getUser.body;
        next();
      }
    }
  } catch (e) {
    ctx.body = e.message;
    ctx.status = 500;
  }
};

export default isAuth;
