import { expect } from 'chai';
import { Utils } from './../src/utils/generic-utils';
import 'mocha';
import { assert } from 'console';

describe('Check Fields', () => {

  describe('Check non-missing fields', () => {
    it('Should return a 200 status code with no body', () => {
      const chekingFields: any = Utils.checkFields(['field1', 'field2', 'field3'], { field1: 'valueField1', field2: 'valueField2', field3: 'valueField3' });
      expect(chekingFields.status).to.be.equal(200);
      expect(chekingFields.body).to.be.equal(undefined);
    });
  });

  describe('Check one missing field', () => {
    it('Should return a 200 status code with no body', () => {
      const chekingFields: any = Utils.checkFields(['field1', 'field2', 'field3'], { field1: 'valueField1', field3: 'valueField3' });
      expect(chekingFields.status).to.be.equal(400);
      expect(chekingFields.body).to.be.equal('Missing field : field2');
    });
  });

  describe('Check two missing fields', () => {
    it('Should return a 200 status code with no body', () => {
      const chekingFields: any = Utils.checkFields(['field1', 'field2', 'field3'], { field3: 'valueField3' });
      expect(chekingFields.status).to.be.equal(400);
      expect(chekingFields.body).to.be.equal('Missing fields : field1,field2');
    });
  });
});