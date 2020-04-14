process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../src/server/index');
const knex = require('../src/server/db/connection');

const should = chai.should();
chai.use(chaiHttp);

describe('routes : movies', () => {
  beforeEach(() => {
    return knex.migrate
      .rollback()
      .then(() => knex.migrate.latest())
      .then(() => knex.seed.run());
  });

  afterEach(() => knex.migrate.rollback());

  describe('GET /api/v1/movies', () => {
    it('should return all movies', (done) => {
      chai
        .request(server)
        .get('/api/v1/movies')
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.eql(200);
          res.type.should.eql('application/json');
          res.body.status.should.eql('success');
          res.body.data.length.should.eql(3);
          res.body.data[0].should.include.keys(
            'id',
            'name',
            'genre',
            'explicit'
          );
          done();
        });
    });
  });
});
