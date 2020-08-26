import { expect } from "chai";
import "mocha";
import { Server } from "./../src/server";
import { UserUtils } from "./../src/utils/user-utils";
import request = require("supertest");

let server: any;
let createdUserId: string = "";
let createdUserToken: string = "";

describe("Start server", () => {
  it("should start the server", async () => {
    server = await Server.startServer();
    console.log("Server started");
  });
});

describe("Sign-up on /auth/signup route", () => {
  describe("Sign-in with missing fields", () => {
    it("Should return status 400 and a list of missing fields", async () => {
      const userRegistration: any = await request
        .agent(server.app)
        .post("/auth/signup")
        .send({ email: "super@domain.com" });
      expect(userRegistration.status).to.be.equal(400);
      expect(userRegistration.text).to.be.equal(
        "Missing fields : password,name"
      );
    });
  });

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

  describe("Sign-up with bad email inputs", () => {
    it("Should return status 400 and email format verification error in the body", async () => {
      const userRegistration: any = await request
        .agent(server.app)
        .post("/auth/signup")
        .send({
          email: "super___domain.com",
          password: "12345",
          name: "coolname",
        });
      expect(userRegistration.status).to.be.equal(400);
      expect(userRegistration.body).not.be.equal(undefined);
      expect(userRegistration.body[0].property).to.be.equal("email");
    });
  });

  describe("Sign-up with already existing email", () => {
    it("Should return status 400 and an already used email adress message", async () => {
      const userRegistration: any = await request
        .agent(server.app)
        .post("/auth/signup")
        .send({
          email: "super@domain.com",
          password: "12345",
          name: "coolname",
        });
      expect(userRegistration.status).to.be.equal(400);
      expect(userRegistration.text).to.be.equal(
        "The specified e-mail address already exists"
      );
    });
  });
});

describe("Sign-in on /auth/signin route", () => {
  describe("Sign-in with missing fields", () => {
    it("Should return status 400 and a list of missing fields", async () => {
      const userAuthentication: any = await request
        .agent(server.app)
        .post("/auth/signin")
        .send({ email: "super_not_existing@domain.com" });
      expect(userAuthentication.status).to.be.equal(400);
      expect(userAuthentication.text).to.be.equal("Missing field : password");
    });
  });

  describe("Sign-in with incorect email", () => {
    it("Should return status 404 and a user does not exist error", async () => {
      const userAuthentication: any = await request
        .agent(server.app)
        .post("/auth/signin")
        .send({ email: "super_not_existing@domain.com", password: "12345" });
      expect(userAuthentication.status).to.be.equal(404);
      expect(userAuthentication.text).to.be.equal("This user does not exist");
    });
  });

  describe("Sign-in with incorect password", () => {
    it("Should return status 401 and an incorrect password error", async () => {
      const userAuthentication: any = await request
        .agent(server.app)
        .post("/auth/signin")
        .send({ email: "super@domain.com", password: "00000" });
      expect(userAuthentication.status).to.be.equal(401);
      expect(userAuthentication.text).to.be.equal("Incorrect password");
    });
  });

  describe("Sign-in with good credentials email", () => {
    it("Should return status 200 and user/token in the body", async () => {
      const userAuthentication: any = await request
        .agent(server.app)
        .post("/auth/signin")
        .send({ email: "super@domain.com", password: "12345" });
      expect(userAuthentication.status).to.be.equal(200);
      expect(userAuthentication.body.token).not.be.equal(undefined);
      expect(userAuthentication.body.user).not.be.equal(undefined);
      expect(userAuthentication.body.user.id).not.be.equal(undefined);
    });
  });
});

describe("Sign-out on /auth/signout route", () => {
  describe("Sign-out without Json Web Token", () => {
    it("Should return status 200 and not yet implemented message", async () => {
      const userSignout: any = await request
        .agent(server.app)
        .post("/auth/signout");
      expect(userSignout.status).to.be.equal(401);
      expect(userSignout.text).to.be.equal("jwt must be provided");
    });
  });

  describe("Sign-out with a valid Json Web Token", () => {
    it("Should return status 200 and not yet implemented message", async () => {
      const userSignout: any = await request
        .agent(server.app)
        .post("/auth/signout")
        .set({ authorization: `Bearer ${createdUserToken}` });
      expect(userSignout.status).to.be.equal(200);
      expect(userSignout.text).to.be.equal("Sign-out is not yet implemented");
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
