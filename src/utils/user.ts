import { getManager } from "typeorm";

import { User } from "../models/user";

export const getOneUser = async (userId: string): Promise<any | User> => {
  return await getManager()
    .getRepository(User)
    .findOne({
      select: ["email", "name", "role", "id"],
      where: { id: userId },
    });
};
