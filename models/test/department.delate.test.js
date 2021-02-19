const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server');
const Department = require('../department.model.js');
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer; 
const mongoose = require('mongoose');

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

let fakeDB;

describe('DELATE /api/departments', () => {
  
  before(async () => {
    
    try {
      fakeDB = new MongoMemoryServer();
      const uri = await fakeDB.getUri();
      await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
      
      const testDepOne = new Department({ _id: '5d9f1140f10a81216cfd4408', name: 'Department #1' });
      await testDepOne.save();
      const testDepTwo = new Department({_id: '5d9f1159f81ce8d1ef2bee48', name: 'Department #2'});
      await testDepTwo.save();
    
    } catch (err) {
      console.log(err);
    }
  });
  
  it('/:id should delate chosen document and return success', async () => {
    const res = await request(server).del('/api/departments/5d9f1140f10a81216cfd4408');
    const delatedDep = await Department.findOne({ name: 'Department #1' });
    expect(res.status).to.be.equal(200);
    expect(delatedDep).to.be.null;
  });
  
  after(async () => {
    await Department.deleteMany();
  });
  
  after(async () => {
    mongoose.models = {};
    await mongoose.disconnect();
    await fakeDB.stop();
  });
});
