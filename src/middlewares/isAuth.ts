import { JwtPayload, verify } from "jsonwebtoken";
import { Context, Next } from "koa";

import { getOneUser } from "../utils/user";

const isAuth = async (ctx: Context, next: Next) => {
  try {
    if (ctx.path.includes("auth/signin") || ctx.path.includes("auth/signup")) {
      return await next();
    }
    let loginToken = null;
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
      const user = await getOneUser(userId);
      if (!user) {
        ctx.status = 404;
        return;
      }
      await next();
    }
  } catch (e) {
    ctx.body = e.message;
    ctx.status = 500;
  }
};

export default isAuth;
