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

describe('GET /api/departments', () => {
  
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
  
  it('/api/departments should return all departments', async () => {
    const res = await request(server).get('/api/departments');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.equal(2);
  });
  
  it('/api/departments/:id should return one department by :id ', async () => {
    const res = await request(server).get('/api/departments/5d9f1140f10a81216cfd4408');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.not.be.null;
  });
  
  it('/api/departments/random should return one random department', async () => {
    const res = await request(server).get('/api/departments/random');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.not.be.null;
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