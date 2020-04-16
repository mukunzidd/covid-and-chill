const knex = require('../connection');

function getAllMovies() {
  return knex('movies').select('*');
}

function getSingleMovie(id) {
  return knex('movies')
    .select('*')
    .where({ id: parseInt(id, 10) });
}

function addMovie(movie) {
  return knex('movies').insert(movie).returning('*');
}

function updateMovie(id, movie) {
  return knex('movies')
    .update(movie)
    .where({ id: parseInt(id, 10) })
    .returning('*');
}

function deleteMovie(id) {
  return knex('movies')
    .del()
    .where({ id: parseInt(id, 10) })
    .returning('*');
}
module.exports = {
  getAllMovies,
  getSingleMovie,
  addMovie,
  updateMovie,
  deleteMovie,
};
