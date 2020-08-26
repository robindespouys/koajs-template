import { validate, ValidationError } from "class-validator";
import { getManager, Repository } from "typeorm";
import validator from "validator";
import { User } from "./../models/user";

export class UserUtils {
  public static async getUser(userId: string): Promise<any> {
    const user = await this.getOneUser(userId);
    if (!user) {
      return {
        status: 404,
        body: "The user you are trying to retrieve doesn't exist in the db",
      };
    }
    if (user instanceof User) {
      return {
        status: 200,
        body: user,
      };
    }
    return user;
  }

  public static async getAllUsers(): Promise<any> {
    const users: User[] = await getManager()
      .getRepository(User)
      .find({ select: ["email", "name", "role", "id"] });
    return {
      status: users.length > 0 ? 200 : 204,
      body: users,
    };
  }

  public static async createUser(parameters: any): Promise<any> {
    const userToCreate: User = new User();
    userToCreate.name = parameters.name;
    userToCreate.email = parameters.email;
    userToCreate.role = parameters.role;
    userToCreate.setHashedPassword(parameters.hashedPassword);
    userToCreate.salt = parameters.salt;
    return await this.validateUser(userToCreate);
  }

  public static async updateUser(
    userId: string,
    newContent: any
  ): Promise<any> {
    const userToBeUpdated = await this.getOneUser(userId);
    if (!userToBeUpdated) {
      return {
        status: 404,
        body: "The user you are trying to update doesn't exist in the db",
      };
    }
    if (userToBeUpdated instanceof User) {
      if (newContent.name) {
        userToBeUpdated.name = newContent.name;
      }
      if (newContent.email) {
        userToBeUpdated.email = newContent.email;
      }
      return await this.validateUser(userToBeUpdated);
    }
    return userToBeUpdated;
  }

  public static async deleteUser(userId: string): Promise<any> {
    const userToDelete = await this.getOneUser(userId);
    if (!userToDelete) {
      return {
        status: 404,
        body: "The user you are trying to delete doesn't exist in the db",
      };
    }
    if (userToDelete instanceof User) {
      await getManager().getRepository(User).remove(userToDelete);
      return {
        status: 204,
        body: `User ${userId} deleted`,
      };
    }
    return userToDelete;
  }

  private static async getOneUser(userId: string): Promise<any | User> {
    if (!validator.isUUID(userId)) {
      return {
        status: 400,
        body: "The user id provided is not a valid UUID",
      };
    }
    return await getManager()
      .getRepository(User)
      .findOne({
        select: ["email", "name", "role", "id"],
        where: { id: userId },
      });
  }

  private static async validateUser(user: User): Promise<any> {
    const errors: ValidationError[] = await validate(user, {
      skipMissingProperties: true,
    });
    const userRepository: Repository<User> = getManager().getRepository(User);
    const result: any = {};
    if (errors.length > 0) {
      const body: any[] = [];
      errors.forEach(error => {
        body.push({
          property: error.property,
          value: error.value,
          constraints: error.constraints,
        });
      });
      result.status = 400;
      result.body = body;
    } else {
      const existingUserWithThisEmail = await userRepository.findOne({
        email: user.email,
      });
      if (
        (existingUserWithThisEmail &&
          user.id &&
          existingUserWithThisEmail.id !== user.id) ||
        (!user.id && existingUserWithThisEmail)
      ) {
        result.status = 400;
        result.body = "The specified e-mail address already exists";
      } else {
        result.status = 201;
        result.body = await userRepository.save(user);
      }
    }
    return result;
  }
}
