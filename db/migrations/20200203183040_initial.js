
exports.up = function(knex) {
  return knex.schema
    .createTable('projects', table => {
      table.increments('id').primary();
      table.string('title');

      table.timestamps(true, true);
    })
    .createTable('colors', table => {
      table.increments('id').primary();
      table.string('hex_code');

      table.timestamps(true, true)
    })
    .createTable('palettes', table => {
      table.increments('id').primary();
      table.string('title');
      table.string('color_1_id');
      table.string('color_2_id');
      table.string('color_3_id');
      table.string('color_4_id');
      table.string('color_5_id');
      table.integer('project_id');
      table.foreign('project_id')
        .references('projects.id');

      table.timestamps(true, true)
    })
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('palettes')
    .dropTable('colors')
    .dropTable('projects')
};
