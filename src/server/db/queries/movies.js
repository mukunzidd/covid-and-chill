const knex = require('../connection');

function getAllMovies() {
  return knex('movies').select('*');
}

function getSingleMovie(id) {
  return knex('movies')
    .select('*')
    .where({ id: parseInt(id, 10) });
}

module.exports = { getAllMovies, getSingleMovie };
