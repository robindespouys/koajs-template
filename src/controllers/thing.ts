import { validate, ValidationError } from "class-validator";
import { getManager, Repository } from "typeorm";
import validator from "validator";

import { Thing } from "../models/thing";

export const getThing = async (thingId: string): Promise<any> => {
  const thing = await getOneThing(thingId);
  if (!thing) {
    return {
      status: 404,
      body: "The thing you are trying to retrieve doesn't exist in the db",
    };
  }
  if (thing instanceof Thing) {
    return {
      status: 200,
      body: thing,
    };
  }
  return thing;
};

export const getAllThings = async (): Promise<any> => {
  const things: Thing[] = await getManager().getRepository(Thing).find();
  return {
    status: things.length > 0 ? 200 : 200,
    body: things,
  };
};

export const createThing = async (parameters: any): Promise<any> => {
  const thingToBeSaved: Thing = new Thing();
  thingToBeSaved.name = parameters.name;
  thingToBeSaved.description = parameters.description;
  thingToBeSaved.quantity = parameters.quantity;
  thingToBeSaved.worth = parameters.worth;
  thingToBeSaved.value = parameters.value;
  return await validateThing(thingToBeSaved);
};

export const updateThing = async (
  thingId: string,
  newContent: any
): Promise<any> => {
  const thingToBeUpdated = await getOneThing(thingId);
  if (!thingToBeUpdated) {
    return {
      status: 404,
      body: "The thing you are trying to update doesn't exist in the db",
    };
  }
  if (thingToBeUpdated instanceof Thing) {
    if (newContent.name) {
      thingToBeUpdated.name = newContent.name;
    }
    if (newContent.description) {
      thingToBeUpdated.description = newContent.description;
    }
    if (newContent.quantity) {
      thingToBeUpdated.quantity = newContent.quantity;
    }
    if (newContent.worth) {
      thingToBeUpdated.worth = newContent.worth;
    }
    if (newContent.value) {
      thingToBeUpdated.value = newContent.value;
    }
    return await validateThing(thingToBeUpdated);
  }
  return thingToBeUpdated;
};

export const deleteThing = async (thingId: string): Promise<any> => {
  const thingToDelete = await getOneThing(thingId);
  if (!thingToDelete) {
    return {
      status: 404,
      body: "The thing you are trying to delete doesn't exist in the db",
    };
  }
  if (thingToDelete instanceof Thing) {
    await getManager().getRepository(Thing).remove(thingToDelete);
    return {
      status: 200,
      body: `Thing ${thingId} deleted`,
    };
  }
  return thingToDelete;
};

export const getOneThing = async (thingId: string): Promise<any | Thing> => {
  if (!validator.isUUID(thingId)) {
    return {
      status: 400,
      body: "The thing id provided is not a valid UUID",
    };
  }
  return await getManager().getRepository(Thing).findOne(thingId);
};

export const validateThing = async (thing: Thing): Promise<any> => {
  const errors: ValidationError[] = await validate(thing, {
    skipMissingProperties: true,
  });
  const thingRepository: Repository<Thing> = getManager().getRepository(Thing);
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
    const existingThingWithThisName = await thingRepository.findOne({
      name: thing.name,
    });
    if (
      (existingThingWithThisName &&
        thing.id &&
        existingThingWithThisName.id !== thing.id) ||
      (!thing.id && existingThingWithThisName)
    ) {
      result.status = 400;
      result.body = "The specified named thing already exists";
    } else {
      result.status = 201;
      result.body = await thingRepository.save(thing);
    }
  }
  return result;
};
