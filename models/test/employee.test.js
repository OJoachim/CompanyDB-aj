const Employee = require('../Employee.model.js');
const expect = require('chai').expect;
const mongoose = require('mongoose');

describe('Employee', () => {
  
  it('should throw an error if no "firstName", "lastName", "department"  arg', () => {
    const emp = new Employee({});
    
    emp.validate(err => {
      expect(err.errors.firstName).to.exist;
      expect(err.errors.lastName).to.exist;
      expect(err.errors.department).to.exist;
    });
  });
  
  it('should throw an error if "firstName", "lastName", "department" is not a string', () => {
    
    const cases = [ {firstName: {}, lastName: {}, department: {}}, {firstName: [], lastName: [], department: []} ];
    
    for (let arg of cases) {
      const emp = new Employee(arg);
      
      emp.validate((err) => {
        expect(err.errors.firstName).to.exist;
        expect(err.errors.lastName).to.exist;
        expect(err.errors.department).to.exist;
      });
    }
  });
  
  it('should not throw an error if "name" is okay', () => {

    const cases = [ {firstName: 'John', lastName: 'Doe', department: 'IT'}, {firstName: 'Abc', lastName: 'cde', department: 'fgh'} ];
    
    for (let arg of cases) {
      const emp = new Employee(arg);
      
      emp.validate((err) => {
        expect(err).to.not.exist;
      });
    }
  });
  
  it('should throw an error if "firstName", "lastName", "department" are too short/long', () => {
    
    const cases = [ {firstName: 'J', lastName: 'De', department: 'T'}, {firstName: 'Ab', lastName: 'cd', department: 'i'} ]; // various cases: too short, too long
    
    for (let arg of cases) {
      const emp = new Employee( {arg} );
      
      emp.validate((err) => {
        expect(err.errors.firstName).to.exist;
        expect(err.errors.lastName).to.exist;
        expect(err.errors.department).to.exist;
      });
    }
  });
  
  after(() => {
    mongoose.models = {};
  });
}); 