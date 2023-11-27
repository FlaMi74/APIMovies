const { migrate } = require("..");

exports.up = knex => knex.schema.createTable("movieLinks", table => {
    table.increments('id');
    table.text('movieUrl').notNullable();

    table.integer('movie_id').references('id').inTable('movies').onDelete("CASCADE");
    table.timestamp('created_at').default(knex.fn.now());

}) ;

exports.down = knex => knex.schema.dropTable('movieLinks');