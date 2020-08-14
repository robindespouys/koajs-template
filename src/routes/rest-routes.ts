// routes/rest-routes.ts
import * as Router from 'koa-router';
import * as controller from './../controllers';

export const restRouter = new Router();

// Routes for the user entity
restRouter.get('/users', controller.user.getAllUsers);
restRouter.get('/users/:id', controller.user.getUser);
restRouter.post('/users', controller.user.createUser);
restRouter.put('/users/:id', controller.user.updateUser);
restRouter.delete('/users/:id', controller.user.deleteUser);
