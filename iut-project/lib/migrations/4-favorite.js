exports.up = function(knex) {

    return knex.schema.createTable('favorites', (table) => {
        table.increments('id').primary();
        table.integer('user_id').unsigned().notNullable();
        table.integer('film_id').unsigned().notNullable();
        table.foreign('user_id').references('user.id').onDelete('CASCADE');
        table.foreign('film_id').references('film.id').onDelete('CASCADE');
        table.unique(['user_id', 'film_id']);
        table.timestamps(true, true);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('favorites');
};
