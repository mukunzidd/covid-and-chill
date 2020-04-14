exports.seed = (knex, promise) => {
  // Deletes ALL existing entries
  return knex('movies')
    .del()
    .then(() => {
      // Inserts seed entries
      return knex('movies').insert([
        {
          name: 'The Land Before Time',
          genre: 'Fantasy',
          rating: 7,
          explicit: false,
        },
        {
          name: 'Jurassic Park',
          genre: 'Science Fiction',
          rating: 9,
          explicit: true,
        },
        {
          name: 'Ice Age: Dawn of the Dinosaurs',
          genre: 'Action/Romance',
          rating: 5,
          explicit: false,
        },
      ]);
    });
};
