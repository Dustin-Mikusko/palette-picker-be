const colors = require('../../../colors');
const users = require('../../../users');

const hexColors = colors.map(color => ({
  hex_code: color
}));

const theUsers = users.map(user => ({
  email: user.email,
  password: user.password,
  name: user.name
}));

exports.seed = async function(knex) {
  try {
    await knex('colors').del();
    await knex.raw('ALTER SEQUENCE colors_id_seq RESTART WITH 1');
    await knex('users').del();
    await knex.raw('ALTER SEQUENCE users_id_seq RESTART WITH 1');
    await knex('users').insert(theUsers);

    return knex('colors').insert(hexColors);
  } catch(error) {
    console.log(`Error seeding data: ${error}`)
  }
};
