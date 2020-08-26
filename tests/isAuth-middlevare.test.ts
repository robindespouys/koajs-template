import { expect } from 'chai';
import isAuth from './../src/middlewares/isAuth';
import { AuthUtils } from './../src/utils/auth-utils';
import { UserUtils } from './../src/utils/user-utils';
import { Server } from './../src/server';
import 'mocha';

let server: any;
let creadtedUserId: string = '';
let createdUserToken: string = '';

describe('Start server', () => {
  it('should start the server', async () => {
    server = await Server.startServer();
    console.log("Server started");
  });
});

describe('Test routes which do not need authentication tokens', () => {

  describe('Test middleware on route /auth/signin', () => {
    it('Should not modify the context and leaves immediatly otherwise an execution error occurs', async () => {
      const ctx: any = {};
      ctx.path = 'auth/signin';
      await isAuth(ctx, () => {
        return new Promise((resolve) => {
          resolve();
        });
      });
    });
  });

  describe('Test middleware on route /auth/signup', () => {
    it('Should not modify the context and leaves immediatly otherwise an execution error occurs', async () => {
      const ctx: any = {};
      ctx.path = 'auth/signup';
      await isAuth(ctx, () => {
        return new Promise((resolve) => {
          resolve();
        });
      });
    });
  });

});

describe('Test token protected routes', () => {

  describe('Test middleware with no authorization header', () => {
    it('Should update the context with status code 401 and missing jwt error', async () => {
      const ctx: any = {};
      ctx.path = '/';
      ctx.req = {};
      ctx.req.headers = {}
      await isAuth(ctx, () => {
        return new Promise((resolve) => {
          resolve();
        });
      });
      expect(ctx.status).to.be.equal(401);
      expect(ctx.body).to.be.equal('jwt must be provided');
    });
  });

  describe('Test middleware with invalid authorization header', () => {
    it('Should update the context with status code 401 and token error message', async () => {
      const ctx: any = {};
      ctx.path = '/';
      ctx.req = {};
      ctx.req.headers = {}
      ctx.req.headers.authorization = 'Bearer invalid-token'
      await isAuth(ctx, () => {
        return new Promise((resolve) => {
          resolve();
        });
      });
      expect(ctx.status).to.be.equal(401);
      expect(ctx.body).to.be.equal('jwt malformed');
    });
  });

  describe('Test middleware with missing header', () => {
    it('Should update the context with status code 500 and undefined property message', async () => {
      const ctx: any = {};
      ctx.path = '/';
      ctx.req = {};
      await isAuth(ctx, () => {
        return new Promise((resolve) => {
          resolve();
        });
      });
      expect(ctx.status).to.be.equal(500);
      console.log(ctx.body);
      expect(ctx.body).to.be.equal('Cannot read property \'authorization\' of undefined');
    });
  });

  describe('Test middleware with a valid authorization header', () => {
    it('Should update the ctx.request.body.currentUser content but not the status nor the body', async () => {
      const userRegistration: any = await AuthUtils.signUp("super@domain.com", "12345", "supername", "user");
      expect(userRegistration.body.token).not.be.equal(undefined);
      expect(userRegistration.body.user.id).not.be.equal(undefined);
      creadtedUserId = userRegistration.body.user.id;
      createdUserToken = userRegistration.body.token;
      const ctx: any = {};
      ctx.path = '/';
      ctx.req = {};
      ctx.req.headers = {};
      ctx.request = {};
      ctx.request.body = {};
      ctx.req.headers.authorization = `Bearer ${userRegistration.body.token}`;
      await isAuth(ctx, () => {
        return new Promise((resolve) => {
          resolve();
        });
      });
      expect(ctx.request.body.currentUser).not.be.equal(undefined);
      expect(ctx.status).to.be.equal(undefined);
      expect(ctx.body).to.be.equal(undefined);
      await UserUtils.deleteUser(creadtedUserId);
    });
  });

  describe('Test middleware with a token from a no more existing user', () => {
    it('Should update the ctx.body and ctx.status content with not found errors', async () => {
      const ctx: any = {};
      ctx.path = '/';
      ctx.req = {};
      ctx.req.headers = {};
      ctx.request = {};
      ctx.request.body = {};
      ctx.req.headers.authorization = `Bearer ${createdUserToken}`;
      await isAuth(ctx, () => {
        return new Promise((resolve) => {
          resolve();
        });
      });
      expect(ctx.status).to.be.equal(404);
      expect(ctx.body).to.be.equal('The user you are trying to retrieve doesn\'t exist in the db');
    });
  });

});

describe('Stop server', () => {
  it('Should stop the server', async () => {
    await server.app.close();
    await server.dbConnection.close();
    console.log("Server stopped");
  });
});
