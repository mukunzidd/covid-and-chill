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
          //   should.not.exist(err);
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
  describe('GET /api/v1/movies/:id', () => {
    it('should return a single movie', (done) => {
      chai
        .request(server)
        .get('/api/v1/movies/2')
        .end((err, res) => {
          //   should.not.exist(err);
          res.status.should.eql(200);
          res.type.should.eql('application/json');
          res.body.status.should.eql('success');
          res.body.data[0].should.include.keys(
            'id',
            'name',
            'genre',
            'explicit'
          );
          done();
        });
    });
    it('should throw and error if the movie does not exist', (done) => {
      chai
        .request(server)
        .get('/api/v1/movies/22222')
        .end((err, res) => {
          //   should.exist(err);
          res.status.should.eql(404);
          res.type.should.eql('application/json');
          res.body.status.should.eql('error');
          res.body.message.should.eql('Movie does not exist');
          done();
        });
    });
  });
  describe('POST /api/v1/movies', () => {
    it('Should return the movie that was added', (done) => {
      chai
        .request(server)
        .post('/api/v1/movies')
        .send({
          name: 'Arrow',
          genre: 'Action',
          rating: 12,
          explicit: true,
        })
        .end((err, res) => {
          res.status.should.eql(201);
          res.type.should.eql('application/json');
          res.body.status.should.eql('success');
          res.body.data[0].should.include.keys(
            'id',
            'name',
            'genre',
            'explicit'
          );
        });
      done();
    });
    it('should throw an error if the payload is malformed', (done) => {
      chai
        .request(server)
        .post('/api/v1/movies')
        .send({
          name: '6 Underground',
        })
        .end((err, res) => {
          // there should be an error ???
          // should.exist(err);
          // there should be a 400 status code
          res.status.should.equal(400);
          // the response should be JSON
          res.type.should.equal('application/json');
          // the JSON response body should have a
          // key-value pair of {"status": "error"}
          res.body.status.should.eql('error');
          // the JSON response body should have a message key
          should.exist(res.body.message);
          done();
        });
    });
  });
  describe('PUT /api/v1/movies/:id', () => {
    it('should return the movie that was updated', (done) => {
      knex('movies')
        .select('*')
        .then((movies) => {
          const movieObject = movies[0];
          chai
            .request(server)
            .put(`/api/v1/movies/${movieObject.id}`)
            .send({
              name: 'The Tales of the Gods',
            })
            .end((err, res) => {
              should.not.exist(err);
              res.status.should.eql(200);
              res.type.should.eql('application/json');
              res.body.status.should.eql('success');
              res.body.data[0].should.include.keys(
                'id',
                'name',
                'genre',
                'rating',
                'explicit'
              );
              const newMovieObject = res.body.data[0];
              newMovieObject.name.should.not.eql(movieObject.name);
              done();
            });
        });
    });
    it('should throw an error if the movie does not exist', (done) => {
      chai
        .request(server)
        .put('/api/v1/movies/1234567890')
        .send({
          name: 'The Tales of the Gods',
        })
        .end((err, res) => {
          // should.not.exist(err);
          res.status.should.eql(404);
          res.type.should.eql('application/json');
          res.body.status.should.eql('error');
          res.body.message.should.eql('Movie does not exist');
          done();
        });
    });
  });
  describe('DELETE /api/v1/movies/:id', () => {
    it('should return the deleted movie', (done) => {
      knex('movies')
        .select('*')
        .then((movies) => {
          const movieObject = movies[0];
          const lengthBeforeDelete = movies.length;
          chai
            .request(server)
            .delete(`/api/v1/movies/${movieObject.id}`)
            .end((err, res) => {
              res.status.should.eql(200);
              res.type.should.eql('application/json');
              res.body.status.should.eql('success');

              res.body.data[0].should.include.keys(
                'id',
                'name',
                'genre',
                'rating',
                'explicit'
              );
              knex('movies')
                .select('*')
                .then((movies) => {
                  lengthBeforeDelete.should.eql(movies.length + 1);
                });
              done();
            });
        });
    });
    it('should throw an error if the movie does not exist', (done) => {
      chai
        .request(server)
        .delete('/api/v1/movies/1234567890')
        .end((err, res) => {
          res.status.should.eql(404);
          res.type.should.eql('application/json');
          res.body.status.should.eql('error');
          res.body.message.should.eql('Movie does not exist');
          done();
        });
    });
  });
});
