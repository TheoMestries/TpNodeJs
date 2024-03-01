exports.up = async (knex) => {
    await knex.schema.alterTable('user', (table) => {
        table.string('role').defaultTo('user');
    });
};

exports.down = async (knex) => {
    await knex.schema.alterTable('user', (table) => {
        table.dropColumn('role');
    });
};
