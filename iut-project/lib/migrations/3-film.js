exports.up = function(knex) {
    return knex.schema.createTable('film', function(table) {
        table.increments('id').primary();
        table.string('titre').notNullable();
        table.text('description').notNullable();
        table.date('dateSortie').notNullable();
        table.string('realisateur').notNullable();
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('film');
};
