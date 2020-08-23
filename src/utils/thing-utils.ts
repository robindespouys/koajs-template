import { getManager, Repository } from 'typeorm';
import { validate, ValidationError } from 'class-validator';
import validator from 'validator';
import { Thing } from './../models/thing';

export class ThingUtils {
  public static async getThing(thingId: string): Promise<any> {
    const thing = await this.getOneThing(thingId);
    if (!thing) {
      return {
        status: 401,
        body: 'The thing you are trying to retrieve doesn\'t exist in the db',
      };
    }
    if (thing instanceof Thing) {
      return {
        status: 200,
        body: thing,
      };
    }
    return thing;
  }

  public static async getAllThings(): Promise<any> {
    const things: Thing[] = await getManager().getRepository(Thing).find();
    return {
      status: things.length > 0 ? 200 : 204,
      body: things,
    };
  }

  public static async createThing(parameters: any): Promise<any> {
    const thingToBeSaved: Thing = new Thing();
    thingToBeSaved.name = parameters.name;
    thingToBeSaved.description = parameters.description;
    thingToBeSaved.quantity = parameters.quantity;
    thingToBeSaved.power = parameters.power;
    return await this.validateThing(thingToBeSaved);
  }

  public static async updateThing(thingId: string, newContent: any): Promise<any> {
    const thingToBeUpdated = await this.getOneThing(thingId);
    if (!thingToBeUpdated) {
      return {
        status: 404,
        body: 'The thing you are trying to update doesn\'t exist in the db',
      };
    }
    if (thingToBeUpdated instanceof Thing) {
      if (newContent.name) { thingToBeUpdated.name = newContent.name; }
      if (newContent.description) { thingToBeUpdated.description = newContent.description; }
      if (newContent.quantity) { thingToBeUpdated.quantity = newContent.quantity; }
      if (newContent.power) { thingToBeUpdated.power = newContent.power; }
      return await this.validateThing(thingToBeUpdated);
    }
    return thingToBeUpdated;
  }

  public static async deleteThing(thingId: string): Promise<any> {
    const thingToDelete = await this.getOneThing(thingId);
    if (!thingToDelete) {
      return {
        status: 404,
        body: 'The thing you are trying to delete doesn\'t exist in the db',
      };
    }
    if (thingToDelete instanceof Thing) {
      return {
        status: 204,
        body: await getManager().getRepository(Thing).remove(thingToDelete),
      };
    }
    return thingToDelete;
  }

  private static async getOneThing(thingId: string): Promise<any | Thing> {
    if (!validator.isUUID(thingId)) {
      return {
        status: 400,
        body: 'The thing id provided is not a valid UUID',
      };
    }
    return await getManager().getRepository(Thing).findOne(thingId);
  }

  private static async validateThing(thing: Thing): Promise<any> {
    const errors: ValidationError[] = await validate(thing, { skipMissingProperties: true });
    const thingRepository: Repository<Thing> = getManager().getRepository(Thing);
    const result: any = {};
    if (errors.length > 0) {
      result.status = 400;
      result.body = errors;
    } else if (await thingRepository.findOne({ name: thing.name })) {
      result.status = 400;
      result.body = 'The specified named thing already exists';
    } else {
      result.status = 201;
      result.body = await thingRepository.save(thing);
    }
    return result;
  }

}