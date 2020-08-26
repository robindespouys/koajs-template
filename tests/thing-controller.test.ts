import { expect } from "chai";
import "mocha";
import { Thing } from "./../src/models/thing";
import { Server } from "./../src/server";
import { UserUtils } from "./../src/utils/user-utils";

import request = require("supertest");

let server: any;
let createdUserId: string = "";
let createdUserToken: string = "";
let createdThing: Thing;

describe("Start server", () => {
  it("should start the server", async () => {
    server = await Server.startServer();
    console.log("Server started");
  });
});

describe("Sign-up on /auth/signup route and retrieve jwt", () => {
  describe("Sign-up with normal inputs", () => {
    it("Should return status 201 and user/token in the body", async () => {
      const userRegistration: any = await request
        .agent(server.app)
        .post("/auth/signup")
        .send({
          email: "super@domain.com",
          password: "12345",
          name: "coolname",
        });
      expect(userRegistration.status).to.be.equal(201);
      expect(userRegistration.body.token).not.be.equal(undefined);
      expect(userRegistration.body.user).not.be.equal(undefined);
      expect(userRegistration.body.user.id).not.be.equal(undefined);
      createdUserId = userRegistration.body.user.id;
      createdUserToken = userRegistration.body.token;
    });
  });
});

describe("Create Things(s) on /things route", () => {
  describe("Create a valid Thing", () => {
    it("Should return status 201 and a representation of the Thing", async () => {
      const thingCreation: any = await request
        .agent(server.app)
        .post("/things")
        .set({ authorization: `Bearer ${createdUserToken}` })
        .send({
          name: "basic thing",
          description: "thing description",
          quantity: 1,
          worth: 1,
          value: 1,
        });
      expect(thingCreation.status).to.equal(201);
      expect(thingCreation.body.quantity).not.be.equal(undefined);
      expect(thingCreation.body.name).to.be.equal("basic thing");
      expect(thingCreation.body.description).to.be.equal("thing description");
      createdThing = thingCreation.body;
    });
  });

  describe("Create a Thing with bad parameters", () => {
    it("Should return status 400 and validations error", async () => {
      const thingCreation: any = await request
        .agent(server.app)
        .post("/things")
        .set({ authorization: `Bearer ${createdUserToken}` })
        .send({
          name: "basic thing",
          description: "thing description",
          quantity: "1",
          worth: "worth",
          value: "1",
        });
      expect(thingCreation.status).to.equal(400);
      expect(thingCreation.body.length).to.be.equal(3);
    });
  });
});

describe("Update Things(s) on /things route", () => {
  describe("Update Thing with good parameters", () => {
    it("Should return status 200 and the updated Thing", async () => {
      const thingUpdate: any = await request
        .agent(server.app)
        .put(`/things/${createdThing.id}`)
        .set({ authorization: `Bearer ${createdUserToken}` })
        .send({
          name: "new thing",
          description: "same thing but different",
          quantity: 1,
          worth: 1,
          value: 1,
        });
      expect(thingUpdate.status).to.equal(201);
      expect(thingUpdate.body.quantity).not.be.equal(undefined);
      expect(thingUpdate.body.name).to.be.equal("new thing");
      expect(thingUpdate.body.description).to.be.equal(
        "same thing but different"
      );
    });
  });
});

describe("Retrieve Things(s) on /things route", () => {
  describe("Retrieve an existing Thing", () => {
    it("Should return status 200 and the updated Thing", async () => {
      const thingUpdate: any = await request
        .agent(server.app)
        .get(`/things/${createdThing.id}`)
        .set({ authorization: `Bearer ${createdUserToken}` });
      expect(thingUpdate.status).to.equal(200);
      expect(thingUpdate.body.quantity).not.be.equal(undefined);
      expect(thingUpdate.body.description).not.be.equal(undefined);
      expect(thingUpdate.body.name).not.be.equal(undefined);
    });
  });

  describe("Update Thing with good parameters", () => {
    it("Should return status 200 and an Array containing representations of the Things", async () => {
      const thingUpdate: any = await request
        .agent(server.app)
        .get("/things")
        .set({ authorization: `Bearer ${createdUserToken}` });
      expect(thingUpdate.status).to.equal(200);
      expect(thingUpdate.body).to.be.instanceof(Array);
      expect(thingUpdate.body.length).to.be.greaterThan(0);
    });
  });
});

describe("Delete Things(s) on /things route", () => {
  describe("Delete the previously created Thing", () => {
    it("Should return status 204 and Thing id deleted message", async () => {
      const thingDeletion: request.Response = await request
        .agent(server.app)
        .delete(`/things/${createdThing.id}`)
        .set({ authorization: `Bearer ${createdUserToken}` });
      expect(thingDeletion.status).to.equal(200);
      expect(thingDeletion.text).to.be.equal(
        `Thing ${createdThing.id} deleted`
      );
    });
  });
});

describe("Stop server", () => {
  it("Should delete the previously created User", async () => {
    await UserUtils.deleteUser(createdUserId);
  });
  it("Should stop the server", async () => {
    await server.app.close();
    await server.dbConnection.close();
    console.log("Server stopped");
  });
});
