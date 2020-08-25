// routes/rest-routes.ts
import * as Router from 'koa-router';
import * as controller from './../controllers';

export const restRouter = new Router();

// Routes for the user entity
restRouter.get('/users', controller.user.getAllUsers);
restRouter.get('/users/:id', controller.user.getUser);
restRouter.put('/users/:id', controller.user.updateUser);

// Routes for the authentication
restRouter.post('/auth/signup', controller.auth.signUp);
restRouter.post('/auth/signin', controller.auth.signIn);
restRouter.post('/auth/signout', controller.auth.signOut);

// Routes for the thing entity
restRouter.get('/things', controller.thing.getAllThings);
restRouter.get('/things/:id', controller.thing.getThing);
restRouter.post('/things', controller.thing.createThing);
restRouter.put('/things/:id', controller.thing.updateThing);
restRouter.delete('/things/:id', controller.thing.deleteThing);
