const colors = require('../../../colors');
const users = require('../../../users');
const projects = require('../../../projects');

const hexColors = colors.map(color => ({
  hex_code: color
}));

const theUsers = users.map(user => ({
  email: user.email,
  password: user.password,
  name: user.name
}));

const theProjects = projects.map(user => ({
  user_id: project.user_id,
  color_1_id: project.color_1_id,
  color_2_id: project.color_2_id,
  color_3_id: project.color_3_id,
  color_4_id: project.color_4_id,
  color_5_id: project.color_5_id,
}));

exports.seed = async function(knex) {
  try {
    await knex('colors').del();
    await knex.raw('ALTER SEQUENCE colors_id_seq RESTART WITH 1');
    await knex('users').del();
    await knex.raw('ALTER SEQUENCE users_id_seq RESTART WITH 1');
    await knex('projects').del();
    await knex.raw('ALTER SEQUENCE users_id_seq RESTART WITH 1');
    await knex('projects').insert(theUsers);
    await knex('users').insert(theUsers);

    return knex('colors').insert(hexColors);
  } catch(error) {
    console.log(`Error seeding data: ${error}`)
  }
};
