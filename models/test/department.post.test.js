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

describe('POST /api/departments', () => {
  
  before(async () => {
    
    try {
      fakeDB = new MongoMemoryServer();
      const uri = await fakeDB.getUri();
      await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
      
      //const testDepOne = new Department({ _id: '5d9f1140f10a81216cfd4408', name: 'Department #1' });
      //await testDepOne.save();
      //const testDepTwo = new Department({_id: '5d9f1159f81ce8d1ef2bee48', name: 'Department #2'});
      //await testDepTwo.save();
    
    } catch (err) {
      console.log(err);
    }
  });
  
  it('/ should insert new document to db and return success', async () => {
    const res = await request(server).post('/api/departments').send({ name: '#Department #1' });
    const newDepartment = await Department.findOne({ name: '#Department #1' });
    expect(res.status).to.be.equal(200);
    expect(res.body.message).to.be.equal('OK');
    expect(newDepartment).to.not.be.null;
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