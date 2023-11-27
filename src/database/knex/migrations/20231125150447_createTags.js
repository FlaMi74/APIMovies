exports.up = knex => knex.schema.createTable("movieTags", table => {
    table.increments('id');
    table.text('movieTag').notNullable();

    table.integer('movie_id').references('id').inTable('movies').onDelete("CASCADE");
    table.integer('user_id').references('id').inTable('users');
}) ;

exports.down = knex => knex.schema.dropTable('movieTags');