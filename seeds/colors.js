const colors = require('../colors');

exports.seed = async function(knex) {
  try {
    await knex('colors').del();

    return knex('colors').insert(colors);
  } catch(error) {
    console.log(`Error seeding data: ${error}`)
  }
};
