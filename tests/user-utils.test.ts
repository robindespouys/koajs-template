import { expect } from "chai";
import "mocha";

import { User } from "./../src/models/user";
import { startServer } from "./../src/server";
import {
  createUser,
  getUser,
  deleteUser,
  getAllUsers,
  updateUser,
} from "../src/controllers/user";

let server: any;
let createdUser: User;

describe("Start server", () => {
  it("Should start the server", async () => {
    server = await startServer();
    console.info("Server started");
  });
});

describe("Create Users", () => {
  describe("Create a valid User", () => {
    it("Should return status 201 and a User instance in body", async () => {
      const userCreation: any = await createUser({
        name: "username",
        email: "user.name@domain.com",
        role: "user",
        hashedPassword: "hashedPassword",
        salt: "salt",
      });
      expect(userCreation.status).to.equal(201);
      expect(userCreation.body).to.be.instanceof(User);
      createdUser = userCreation.body;
    });
  });

  describe("Create an existing User", () => {
    it("Should return status 400 and already exists error", async () => {
      const userCreation: any = await createUser({
        name: "username",
        email: "user.name@domain.com",
        role: "user",
        hashedPassword: "hashedPassword",
        salt: "salt",
      });
      expect(userCreation.status).to.equal(400);
      expect(userCreation.body).to.be.equal(
        "The specified e-mail address already exists"
      );
    });
  });

  describe("Create a User with bad parameters", () => {
    it("Should return status 400 and email validation error", async () => {
      const userCreation: any = await createUser({
        name: "username",
        email: "user.name-domain.com",
        role: "user",
        hashedPassword: "hashedPassword",
        salt: "salt",
      });
      expect(userCreation.status).to.equal(400);
      expect(userCreation.body[0].property).to.equal("email");
    });
  });
});

describe("Retrieve existing Users", () => {
  describe("Retrieve a User with a non-valid UUID", () => {
    it("Should return status 400 and a no valid UUID message", async () => {
      const userEntry = await getUser("non-valid-UUID");
      expect(userEntry.status).to.equal(400);
      expect(userEntry.body).to.be.equal(
        "The user id provided is not a valid UUID"
      );
    });
  });

  describe("Retrieve an existing User", () => {
    it("Should return status 200 and a representation of the User", async () => {
      const userEntry = await getUser(createdUser.id);
      expect(userEntry.status).to.equal(200);
      expect(userEntry.body).to.be.instanceof(User);
    });
  });

  describe("Retrieve all Users", () => {
    it("Should return status 200 and an Array containing representations of the Users", async () => {
      const userEntry = await getAllUsers();
      expect(userEntry.status).to.equal(200);
      expect(userEntry.body).to.be.a.instanceof(Array);
      expect(userEntry.body.length).to.be.greaterThan(0);
    });
  });
});

describe("Update existing Users", () => {
  describe("Update a User with a non-valid UUID", () => {
    it("Should return status 400 and a no valid UUID message", async () => {
      const updatedUser = await updateUser("non-valid-UUID", {});
      expect(updatedUser.status).to.equal(400);
      expect(updatedUser.body).to.be.equal(
        "The user id provided is not a valid UUID"
      );
    });
  });

  describe("Update a User with bad parameters", () => {
    it("Should return status 400 and email validation error", async () => {
      const updatedUser = await updateUser(createdUser.id, {
        name: "newName",
        email: "email-domain.com",
      });
      expect(updatedUser.status).to.equal(400);
      expect(updatedUser.body[0].property).to.equal("email");
    });
  });

  describe("Update a User with missing parameters", () => {
    it("Should return status 200 and the non-updated User", async () => {
      const updatedUser = await updateUser(createdUser.id, {});
      expect(updatedUser.status).to.equal(201);
      expect(updatedUser.body).to.be.instanceof(User);
      expect(updatedUser.body.name).to.be.equal("username");
      expect(updatedUser.body.email).to.be.equal("user.name@domain.com");
    });
  });

  describe("Update a User with good parameters", () => {
    it("Should return status 200 and the updated User", async () => {
      const updatedUser = await updateUser(createdUser.id, {
        name: "newName",
        email: "email@domain.com",
      });
      expect(updatedUser.status).to.equal(201);
      expect(updatedUser.body).to.be.instanceof(User);
      expect(updatedUser.body.name).to.be.equal("newName");
      expect(updatedUser.body.email).to.be.equal("email@domain.com");
    });
  });
});

describe("Delete Users", () => {
  describe("Delete a User with a non-valid UUID", () => {
    it("Should return status 400 and a no valid UUID message", async () => {
      const userEntry = await deleteUser("non-valid-UUID");
      expect(userEntry.status).to.equal(400);
      expect(userEntry.body).to.be.equal(
        "The user id provided is not a valid UUID"
      );
    });
  });

  describe("Delete the previously created User", () => {
    it(`Should return status 204 and User id deleted message`, async () => {
      const userDeletion = await deleteUser(createdUser.id);
      expect(userDeletion.status).to.equal(204);
      expect(userDeletion.body).to.equal(`User ${createdUser.id} deleted`);
    });
  });

  describe("Delete a non-existing User", () => {
    it(`Should return status 404 and a non-existing message`, async () => {
      const userDeletion = await deleteUser(createdUser.id);
      expect(userDeletion.status).to.equal(404);
      expect(userDeletion.body).to.equal(
        "The user you are trying to delete doesn't exist in the db"
      );
    });
  });
});

describe("Retrieve non existing Users", () => {
  describe("Retrieve a non existing User", () => {
    it("Should return status 404 and a non-existing message", async () => {
      const userEntry = await getUser(createdUser.id);
      expect(userEntry.status).to.equal(404);
      expect(userEntry.body).to.be.equal(
        "The user you are trying to retrieve doesn't exist in the db"
      );
    });
  });

  describe("Retrieve all Users when no single one existing User", () => {
    before(async () => {
      const retrievedUsers = await getAllUsers();
      if (retrievedUsers.status === 200) {
        const users: any[] = retrievedUsers.body;
        for (const user of users) {
          await deleteUser(user.id);
        }
      }
    });
    it("Should return status 204 and an empty Array", async () => {
      const userEntry = await getAllUsers();
      expect(userEntry.status).to.equal(204);
      expect(userEntry.body).to.be.a.instanceof(Array);
      expect(userEntry.body.length).to.be.equal(0);
    });
  });
});

describe("Update a non-existing User", () => {
  describe("Update a User with good parameters", () => {
    it("Should return status 404 and a non-existing message", async () => {
      const updatedUser = await updateUser(createdUser.id, {
        name: "newName",
        email: "email@domain.com",
      });
      expect(updatedUser.status).to.equal(404);
      expect(updatedUser.body).to.be.equal(
        "The user you are trying to update doesn't exist in the db"
      );
    });
  });
});

describe("Stop server", () => {
  it("Should stop the server", async () => {
    await server.app.close();
    await server.dbConnection.close();
    console.info("Server stopped");
  });
});
