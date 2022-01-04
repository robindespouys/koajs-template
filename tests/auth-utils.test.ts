import { expect } from "chai";
import "mocha";
import { startServer } from "./../src/server";
import { Auth } from "../src/controllers/auth";
import { deleteUser } from "../src/controllers/user";

let server: any;
let creadtedUserId: string = "";

describe("Start server", () => {
  it("should start the server", async () => {
    server = await startServer();
    console.info("Server started");
  });
});

describe("Sign-up to the server", () => {
  describe("Sign-up with normal inputs", () => {
    it("Should return status 201 and user/token in the body", async () => {
      const userRegistration: any = await Auth.signUp(
        "super@domain.com",
        "12345",
        "supername",
        "user"
      );
      expect(userRegistration.status).to.be.equal(201);
      expect(userRegistration.body.token).not.be.equal(undefined);
      expect(userRegistration.body.user).not.be.equal(undefined);
      expect(userRegistration.body.user.id).not.be.equal(undefined);
      creadtedUserId = userRegistration.body.user.id;
    });
  });

  describe("Sign-up with bad email inputs", () => {
    it("Should return status 400 and email format verification error in the body", async () => {
      const userRegistration: any = await Auth.signUp(
        "super___domain.com",
        "12345",
        "supername",
        "user"
      );
      expect(userRegistration.status).to.be.equal(400);
      expect(userRegistration.body).not.be.equal(undefined);
      expect(userRegistration.body[0].property).to.be.equal("email");
    });
  });

  describe("Sign-up with already existing email", () => {
    it("Should return status 400 and an already used email adress message", async () => {
      const userRegistration: any = await Auth.signUp(
        "super@domain.com",
        "12345",
        "supername",
        "user"
      );
      expect(userRegistration.status).to.be.equal(400);
      expect(userRegistration.body).to.be.equal(
        "The specified e-mail address already exists"
      );
    });
  });
});

describe("Sign-in to the server", () => {
  describe("Sign-in with incorect email", () => {
    it("Should return status 404 and a user does not exist error", async () => {
      const userRegistration: any = await Auth.signIn(
        "super_not_existing@domain.com",
        "12345"
      );
      expect(userRegistration.status).to.be.equal(404);
      expect(userRegistration.body).to.be.equal("This user does not exist");
    });
  });

  describe("Sign-in with incorect password", () => {
    it("Should return status 401 and an incorrect password error", async () => {
      const userRegistration: any = await Auth.signIn(
        "super@domain.com",
        "00000"
      );
      expect(userRegistration.status).to.be.equal(401);
      expect(userRegistration.body).to.be.equal("Incorrect password");
    });
  });

  describe("Sign-in with good credentials email", () => {
    it("Should return status 200 and user/token in the body", async () => {
      const userRegistration: any = await Auth.signIn(
        "super@domain.com",
        "12345"
      );
      expect(userRegistration.status).to.be.equal(200);
      expect(userRegistration.body.token).not.be.equal(undefined);
      expect(userRegistration.body.user).not.be.equal(undefined);
      expect(userRegistration.body.user.id).not.be.equal(undefined);
    });
  });
});

describe("Stop server", () => {
  it("Should delete the previously created User", async () => {
    await deleteUser(creadtedUserId);
  });
  it("Should stop the server", async () => {
    await server.app.close();
    await server.dbConnection.close();
    console.info("Server stopped");
  });
});
