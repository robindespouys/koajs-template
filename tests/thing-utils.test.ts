import { expect } from 'chai';
import { ThingUtils } from './../src/utils/thing-utils';
import { Thing } from './../src/models/thing';
import { Server } from './../src/server';
import request = require('supertest');
import 'mocha';

let server: any;
let createdThing: Thing;

describe('Start server', async () => {
  it('sould start the server', async () => {
    server = await Server.startServer();
    console.log("Server started");
  })
});

describe('Create things', () => {

  describe('Create a valid Thing', () => {
    it('Should return status 201 and a Thing instance in body', async () => {
      const thingCreation: any = await ThingUtils.createThing({
        name: 'basic thing',
        description: 'thing description',
        quantity: 1,
        worth: 1,
        value: 1,
      });
      expect(thingCreation.status).to.equal(201);
      expect(thingCreation.body).to.be.instanceof(Thing);
      createdThing = thingCreation.body;
    });
  });

  describe('Create an existing Thing', () => {
    it('Should return status 400 and already exists error', async () => {
      const thingCreation: any = await ThingUtils.createThing({
        name: 'basic thing',
        description: 'thing description',
        quantity: 1,
        worth: 1,
        value: 1,
      });
      expect(thingCreation.status).to.equal(400);
      expect(thingCreation.body).to.be.equal('The specified named thing already exists');
    });
  });

  describe('Create a Thing with bad parameters', () => {
    it('Should return status 400 and validations error', async () => {
      const thingCreation: any = await ThingUtils.createThing({
        name: 100,
        description: 10,
        quantity: '100',
        worth: 'worth',
        value: 'null',
      });
      expect(thingCreation.status).to.equal(400);
      expect(thingCreation.body.length).to.be.equal(5);
    });
  });

});

describe('Retrieve existing Things', () => {
  describe('Retrieve a Thing with a non-valid UUID', () => {
    it('Should return status 400 and a no valid UUID message', async () => {
      const thingEntry = await ThingUtils.getThing('non-valid-UUID');
      expect(thingEntry.status).to.equal(400);
      expect(thingEntry.body).to.be.equal('The thing id provided is not a valid UUID');
    });
  });

  describe('Retrieve an existing Thing', () => {
    it('Should return status 200 and a representation of the Thing', async () => {
      const thingEntry = await ThingUtils.getThing(createdThing.id);
      expect(thingEntry.status).to.equal(200);
      expect(thingEntry.body).to.be.instanceof(Thing);
    });
  });

  describe('Retrieve all Things', () => {
    it('Should return status 200 and an Array containing representations of the Things', async () => {
      const thingEntry = await ThingUtils.getAllThings();
      expect(thingEntry.status).to.equal(200);
      expect(thingEntry.body).to.be.a.instanceof(Array);
      expect(thingEntry.body.length).to.be.greaterThan(0);
    });
  });
});

describe('Update existing Things', () => {
  describe('Update a Thing with a non-valid UUID', () => {
    it('Should return status 400 and a no valid UUID message', async () => {
      const updatedThing = await ThingUtils.updateThing('non-valid-UUID', {});
      expect(updatedThing.status).to.equal(400);
      expect(updatedThing.body).to.be.equal('The thing id provided is not a valid UUID');
    });
  });

  describe('Update a Thing with bad parameters', () => {
    it('Should return status 400 and worth validation error', async () => {
      const updatedThing = await ThingUtils.updateThing(createdThing.id, { name: 'basic thing', description: 'thing description', quantity: 1, worth: 'worth', value: 1, });
      expect(updatedThing.status).to.equal(400);
      expect(updatedThing.body[0].property).to.equal('worth');
    });
  });

  describe('Update a Thing with missing parameters', () => {
    it('Should return status 200 and the non-updated Thing', async () => {
      const updatedThing = await ThingUtils.updateThing(createdThing.id, {});
      expect(updatedThing.status).to.equal(201);
      expect(updatedThing.body).to.be.instanceof(Thing);
      expect(updatedThing.body.name).to.be.equal('basic thing');
      expect(updatedThing.body.description).to.be.equal('thing description');
    });
  });

  describe('Update a Thing with good parameters', () => {
    it('Should return status 200 and the updated Thing', async () => {
      const updatedThing = await ThingUtils.updateThing(createdThing.id, { name: 'new basic thing', description: 'new thing description', quantity: 1, worth: 1, value: 1, });
      expect(updatedThing.status).to.equal(201);
      expect(updatedThing.body).to.be.instanceof(Thing);
      expect(updatedThing.body.name).to.be.equal('new basic thing');
      expect(updatedThing.body.description).to.be.equal('new thing description');
    });
  });
});

describe('Delete Things', () => {
  describe('Delete a Thing with a non-valid UUID', () => {
    it('Should return status 400 and a non valid UUID message', async () => {
      const thingEntry = await ThingUtils.deleteThing('non-valid-UUID');
      expect(thingEntry.status).to.equal(400);
      expect(thingEntry.body).to.be.equal('The thing id provided is not a valid UUID');
    });
  });

  describe('Delete the previously created Thing', () => {
    it(`Should return status 204 and Thing id deleted message`, async () => {
      const thingDeletion = await ThingUtils.deleteThing(createdThing.id);
      expect(thingDeletion.status).to.equal(204);
      expect(thingDeletion.body).to.equal(`Thing ${createdThing.id} deleted`);
    });
  });

  describe('Delete a non-existing Thing', () => {
    it(`Should return status 404 and a non-existing message`, async () => {
      const thingDeletion = await ThingUtils.deleteThing(createdThing.id);
      expect(thingDeletion.status).to.equal(404);
      expect(thingDeletion.body).to.equal('The thing you are trying to delete doesn\'t exist in the db');
    });
  });
});

describe('Retrieve non existing Things', () => {
  describe('Retrieve a non existing Thing', () => {
    it('Should return status 404 and a non-existing message', async () => {
      const thingEntry = await ThingUtils.getThing(createdThing.id);
      expect(thingEntry.status).to.equal(404);
      expect(thingEntry.body).to.be.equal('The thing you are trying to retrieve doesn\'t exist in the db');
    });
  });

  describe('Retrieve all Things when no single one existing Thing', () => {
    before(async () => {
      const retrievedThings = await ThingUtils.getAllThings();
      if (retrievedThings.status === 200) {
        const things: any[] = retrievedThings.body;
        for (const thing of things) {
          await ThingUtils.deleteThing(thing.id);
        }
      }
    });
    it('Should return status 204 and an empty Array', async () => {
      const thingEntry = await ThingUtils.getAllThings();
      expect(thingEntry.status).to.equal(204);
      expect(thingEntry.body).to.be.a.instanceof(Array);
      expect(thingEntry.body.length).to.be.equal(0);
    });
  });
});

describe('Update a non-existing Thing', () => {

  describe('Update a Thing with good parameters', () => {
    it('Should return status 404 and a non-existing message', async () => {
      const updatedThing = await ThingUtils.updateThing(createdThing.id, { name: 'new basic thing', description: 'new thing description', quantity: 1, worth: 1, value: 1, });
      expect(updatedThing.status).to.equal(404);
      expect(updatedThing.body).to.be.equal('The thing you are trying to update doesn\'t exist in the db');
    });
  });
});

describe('Stop server', async () => {
  it('sould stop the server', async () => {
    await server.app.close();
    await server.dbConnection.close();
    console.log("Server stopped");
  })
});