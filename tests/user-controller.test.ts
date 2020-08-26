import { expect } from 'chai';
import { UserUtils } from './../src/utils/user-utils';
import { Server } from './../src/server';
import request = require('supertest');
import 'mocha';

let server: any;
let createdUserId: string = '';
let createdUserToken: string = '';

describe('Start server', () => {
  it('should start the server', async () => {
    server = await Server.startServer();
    console.log("Server started");
  });
});

describe('Sign-up on /auth/signup route and retrieve jwt', () => {

  describe('Sign-up with normal inputs', () => {
    it('Should return status 201 and user/token in the body', async () => {
      const userRegistration: any = await request.agent(server.app).post('/auth/signup').send({ 'email': 'super@domain.com', 'password': '12345', 'name': 'coolname' });
      expect(userRegistration.status).to.be.equal(201);
      expect(userRegistration.body.token).not.be.equal(undefined);
      expect(userRegistration.body.user).not.be.equal(undefined);
      expect(userRegistration.body.user.id).not.be.equal(undefined);
      createdUserId = userRegistration.body.user.id;
      createdUserToken = userRegistration.body.token;
    });
  });

});

describe('Get User(s) on /users route', () => {

  describe('Get all users without jwt', () => {
    it('Should return status 401 and a jwt error', async () => {
      const getUsers: any = await request.agent(server.app).get('/users');
      expect(getUsers.status).to.be.equal(401);
      expect(getUsers.text).to.be.equal('jwt must be provided');
    });
  });

  describe('Get all users with jwt', () => {
    it('Should return status 200 and an Array containing representations of the Users', async () => {
      const getUsers: any = await request.agent(server.app).get('/users').set({ 'authorization': `Bearer ${createdUserToken}` });
      expect(getUsers.status).to.be.equal(200);
      expect(getUsers.body).to.be.a.instanceof(Array);
      expect(getUsers.body.length).to.be.greaterThan(0);
    });
  });

  describe('Get one user without jwt', () => {
    it('Should return status 401 and a jwt error', async () => {
      const getUser: any = await request.agent(server.app).get(`/users/${createdUserId}`);
      expect(getUser.status).to.be.equal(401);
      expect(getUser.text).to.be.equal('jwt must be provided');
    });
  });

  describe('Get one user with jwt', () => {
    it('Should return status 200 and the user informations', async () => {
      const getUser: any = await request.agent(server.app).get(`/users/${createdUserId}`).set({ 'authorization': `Bearer ${createdUserToken}` });
      expect(getUser.status).to.be.equal(200);
      expect(getUser.body.id).not.be.equal(undefined);
      expect(getUser.body.name).not.be.equal(undefined);
      expect(getUser.body.email).not.be.equal(undefined);
    });
  });

});

describe('Update a User on /users route', () => {

  describe('Update a user without jwt', () => {
    it('Should return status 401 and a jwt error', async () => {
      const updatedUser: any = await request.agent(server.app).put(`/users/${createdUserId}`)
        .send({ 'name': 'newName', 'email': 'new-email@domain.com' });
      expect(updatedUser.status).to.be.equal(401);
      expect(updatedUser.text).to.be.equal('jwt must be provided');

    });
  });

  describe('Update one user with jwt', () => {
    it('Should return status 201 and return the updated fields', async () => {
      const updatedUser: any = await request.agent(server.app).put(`/users/${createdUserId}`)
        .send({ 'name': 'newName', 'email': 'new-email@domain.com' }).set({ 'authorization': `Bearer ${createdUserToken}` });
      expect(updatedUser.status).to.be.equal(201);
      expect(updatedUser.body.name).to.be.equal('newName');
      expect(updatedUser.body.email).to.be.equal('new-email@domain.com');
    });
  });

});

describe('Stop server', () => {

  it('Should delete the previously created User', async () => {
    await UserUtils.deleteUser(createdUserId);
  });
  it('Should stop the server', async () => {
    await server.app.close();
    await server.dbConnection.close();
    console.log("Server stopped");
  });

});