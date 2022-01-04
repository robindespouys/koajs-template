// routes/rest-routes.ts
import Router from "koa-router";

import {
  AuthController,
  ThingController,
  UserController,
} from "./../controllers";

const restRouter = new Router();

// Routes for the user entity
restRouter.get("/users", UserController.getAllUsers);
restRouter.get("/users/:id", UserController.getUser);
restRouter.put("/users/:id", UserController.updateUser);

// Routes for the authentication
restRouter.post("/auth/signup", AuthController.signUp);
restRouter.post("/auth/signin", AuthController.signIn);
restRouter.post("/auth/signout", AuthController.signOut);

// Routes for the thing entity
restRouter.get("/things", ThingController.getAllThings);
restRouter.get("/things/:id", ThingController.getThing);
restRouter.post("/things", ThingController.createThing);
restRouter.put("/things/:id", ThingController.updateThing);
restRouter.delete("/things/:id", ThingController.deleteThing);

export default restRouter;
