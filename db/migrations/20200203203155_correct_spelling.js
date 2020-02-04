
exports.up = function(knex) {
  return knex.schema
    .createTable('users', table => {
      table.increments('id').primary();
      table.string('email');
      table.string('name');
      table.integer('palette_1_id').unsigned();
      table.integer('palette_2_id').unsigned();
      table.integer('palette_3_id').unsigned();

      table.timestamps(true, true);
    })
    .createTable('colors', table => {
      table.increments('id').primary();
      table.string('hex_code');

      table.timestamps(true, true)
    })
    .createTable('projects', table => {
      table.increments('id').primary();
      table.foreign('user_id')
        .references('users.id');
      table.foreign('color_1_id')
        .references('colors.id');
      table.foreign('color_2_id')
        .references('colors.id');
      table.foreign('color_3_id')
        .references('colors.id');
      table.foreign('color_4_id')
        .references('colors.id');
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
