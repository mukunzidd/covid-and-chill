process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../src/server/index');

chai.use(chaiHttp);
const should = chai.should();

describe('routes: index', () => {
  describe('GET /', () => {
    it('should return JSON', (done) => {
      chai
        .request(server)
        .get('/')
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.eql(200);
          res.type.should.eql('application/json');
          res.body.status.should.eql('success');
          res.body.message.should.eql('Hello 🌍');
          done();
        });
    });
  });
});
