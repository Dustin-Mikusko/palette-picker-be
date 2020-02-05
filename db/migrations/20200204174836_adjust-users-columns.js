
exports.up = function(knex) {
  return knex.schema
  .createTable('users', table => {
    table.increments('id').primary();
    table.string('email');
    table.string('password');
    table.string('name');
  })
  .createTable('colors', table => {
    table.increments('id').primary();
    table.string('hex_code');

    table.timestamps(true, true)
  })
  .createTable('projects', table => {
    table.increments('id').primary();
    table.integer('user_id').unsigned();
    table.foreign('user_id')
      .references('users.id');
    table.integer('color_1_id').unsigned();
    table.foreign('color_1_id')
      .references('colors.id');
    table.integer('color_2_id').unsigned();
    table.foreign('color_2_id')
      .references('colors.id');
    table.integer('color_3_id').unsigned();
    table.foreign('color_3_id')
      .references('colors.id');
    table.integer('color_4_id').unsigned();
    table.foreign('color_4_id')
      .references('colors.id');
    table.integer('color_5_id').unsigned();
    table.foreign('color_5_id')
      .references('colors.id');

    table.timestamps(true, true)
  })
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('projects')
    .dropTable('colors')
    .dropTable('users')
};
