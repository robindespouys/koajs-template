import { validate, ValidationError } from "class-validator";
import { Context } from "koa";
import { DeepPartial, getManager, Repository } from "typeorm";

import { getOneUser } from "../utils/user";
import { User } from "../models/user";

export const getUser = async (ctx: Context, userId: string): Promise<void> => {
  const user = await getOneUser(userId);
  if (!user) {
    ctx.status = 404;
    ctx.body = "The user you are trying to retrieve doesn't exist in the db";
    return;
  }
  ctx.body = user;
};

export const getAllUsers = async (ctx: Context): Promise<void> => {
  const users: User[] = await getManager()
    .getRepository(User)
    .find({ select: ["email", "name", "role", "id"] });
  if (users.length === 0) {
    ctx.status = 202;
    return;
  }
  ctx.body = users;
};

export const createUser = async (
  parameters: DeepPartial<User>
): Promise<User> => {
  const repository = getManager().getRepository(User);
  const user = repository.create({ ...parameters });
  return await repository.save(user);
};

export const updateUser = async (
  ctx: Context,
  userId: string,
  newContent: any
): Promise<void> => {
  const userToBeUpdated = await getOneUser(userId);
  if (!userToBeUpdated) {
    ctx.status = 404;
    ctx.body = "The user you are trying to update doesn't exist in the db";
  }
  if (userToBeUpdated instanceof User) {
    if (newContent.name) {
      userToBeUpdated.name = newContent.name;
    }
    if (newContent.email) {
      userToBeUpdated.email = newContent.email;
    }
    return await validateUser(userToBeUpdated);
  }
  ctx.body = userToBeUpdated;
};

export const deleteUser = async (
  ctx: Context,
  userId: string
): Promise<void> => {
  const userToDelete = await getOneUser(userId);
  if (!userToDelete) {
    ctx.status = 404;
    ctx.body = "The user you are trying to delete doesn't exist in the db";
    return;
  }
  if (userToDelete instanceof User) {
    await getManager().getRepository(User).remove(userToDelete);

    ctx.status = 204;
    ctx.body = `User ${userId} deleted`;
    return;
  }
  ctx.body = userToDelete;
};

const validateUser = async (user: User): Promise<any> => {
  const errors: ValidationError[] = await validate(user, {
    skipMissingProperties: true,
  });
  const userRepository: Repository<User> = getManager().getRepository(User);
  const result: any = {};
  if (errors.length > 0) {
    const body: any[] = [];
    for (const error of errors) {
      body.push({
        property: error.property,
        value: error.value,
        constraints: error.constraints,
      });
    }
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
};
