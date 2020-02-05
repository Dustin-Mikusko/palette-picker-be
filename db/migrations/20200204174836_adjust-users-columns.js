
exports.up = function(knex) {
  return knex.schema.table('users', table => {
    table.dropColumn('palette_1_id');
    table.dropColumn('palette_2_id');
    table.dropColumn('palette_3_id');
    table.dropColumn('created_at');
    table.dropColumn('updated_at'');
    table.string('password');
  })
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('projects')
    .dropTable('colors')
    .dropTable('users')
};
