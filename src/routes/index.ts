// routes/rest-routes.ts
import Router from "koa-router";

import * as UserRoutes from "./user";
import * as AuthRoutes from "./auth";
import * as ThingRoutes from "./thing";

const restRouter = new Router();

// Routes for the user entity
restRouter.get("/users", UserRoutes.getAllUsers);
restRouter.get("/users/:id", UserRoutes.getUser);
restRouter.put("/users/:id", UserRoutes.updateUser);

// Routes for the authentication
restRouter.post("/auth/signup", AuthRoutes.signUp);
restRouter.post("/auth/signin", AuthRoutes.signIn);
restRouter.post("/auth/signout", AuthRoutes.signOut);

// Routes for the thing entity
restRouter.get("/things", ThingRoutes.getAllThings);
restRouter.get("/things/:id", ThingRoutes.getThing);
restRouter.post("/things", ThingRoutes.createThing);
restRouter.put("/things/:id", ThingRoutes.updateThing);
restRouter.delete("/things/:id", ThingRoutes.deleteThing);

export default restRouter;
