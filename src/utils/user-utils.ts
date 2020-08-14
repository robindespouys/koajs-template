import { getManager, Repository } from 'typeorm';
import { validate, ValidationError } from 'class-validator';
import validator from 'validator';
import { User } from './../models/user';

export class UserUtils {
  public static async getUser(userId: string): Promise<any> {
    const user = await this.getOneUser(userId);
    if (!user) {
      return {
        status: 401,
        body: 'The user you are trying to retrieve doesn\'t exist in the db',
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
    const users: User[] = await getManager().getRepository(User).find();
    return {
      status: users.length > 0 ? 200 : 204,
      body: users,
    };
  }

  public static async createUser(parameters: any): Promise<any> {
    const userToBeSaved: User = new User();
    userToBeSaved.name = parameters.name;
    userToBeSaved.email = parameters.email;
    return await this.validateUser(userToBeSaved);
  }

  public static async updateUser(userId: string, newContent: any): Promise<any> {
    const userToBeUpdated = await this.getOneUser(userId);
    if (!userToBeUpdated) {
      return {
        status: 404,
        body: 'The user you are trying to update doesn\'t exist in the db',
      };
    }
    if (userToBeUpdated instanceof User) {
      if (newContent.name) { userToBeUpdated.name = newContent.name; }
      if (newContent.email) { userToBeUpdated.email = newContent.email; }
      return await this.validateUser(userToBeUpdated);
    }
    return userToBeUpdated;
  }

  public static async deleteUser(userId: string): Promise<any> {
    const userToDelete = await this.getOneUser(userId);
    if (!userToDelete) {
      return {
        status: 404,
        body: 'The user you are trying to delete doesn\'t exist in the db',
      };
    }
    if (userToDelete instanceof User) {
      return {
        status: 204,
        body: await getManager().getRepository(User).remove(userToDelete),
      };
    }
    return userToDelete;
  }

  private static async getOneUser(userId: string): Promise<any | User> {
    if (!validator.isUUID(userId)) {
      return {
        status: 400,
        body: 'The user id provided is not a valid UUID',
      };
    }
    return await getManager().getRepository(User).findOne(userId);
  }

  private static async validateUser(user: User): Promise<any> {
    const errors: ValidationError[] = await validate(user, { skipMissingProperties: true });
    const userRepository: Repository<User> = getManager().getRepository(User);
    const result: any = {};
    if (errors.length > 0) {
      result.status = 400;
      result.body = errors;
    } else if (await userRepository.findOne({ email: user.email })) {
      result.status = 400;
      result.body = 'The specified e-mail address already exists';
    } else {
      result.status = 201;
      result.body = await userRepository.save(user);
    }
    return result;
  }

}