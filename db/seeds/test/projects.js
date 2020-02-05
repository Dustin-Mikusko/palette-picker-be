const projects = require('../../../projects');

const createProject = async (knex, project) => {
  const projectId = await knex('projects').insert({
    title: project.title
  }, 'id');

  let palettePromises = project.palettes.map(palette => {
    return createPalette(knex, {
      title: palette.title,
      color_1_id: palette.color_1_id,
      color_2_id: palette.color_2_id,
      color_3_id: palette.color_3_id,
      color_4_id: palette.color_4_id,
      color_5_id: palette.color_5_id,
      project_id: projectId[0]
    })
  });

  return Promise.all(palettePromises);
}

const createPalette = (knex, palette) => {
  return knex('palettes').insert(palette)
};

exports.seed = async function(knex) {
  try {
    await knex('colors').del();
    await knex('palettes').del();
    await knex('projects').del();
    // await knex.raw('ALTER SEQUENCE users_id_seq RESTART WITH 1');

    let projectPromises = projects.map(project => {
      return createProject(knex, project);
    })

    return Promise.all(projectPromises);

  } catch(error) {
    console.log(`Error seeding data: ${error}`)
  }
};
