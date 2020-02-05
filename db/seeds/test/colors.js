const colors = require('../../../colors');

const hexColors = colors.map(color => ({
  hex_code: color
}));


exports.seed = async function(knex) {
  try {
    await knex('colors').del();

    return knex('colors').insert(hexColors);
  } catch(error) {
    console.log(`Error seeding data: ${error}`)
  }
};
