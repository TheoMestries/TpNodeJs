const Encrypt = require('@theom19/iut-encrypt');

exports.up = async function(knex) {
    const hashedPassword = Encrypt.sha1('Admin123');


    await knex('user').insert({
        firstName: 'Admin',
        lastName: 'Admin',
        username: 'Admin',
        mail: 'admin@admin.com',
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
    });
};

exports.down = function(knex) {
    return knex('user').where('username', 'Admin').delete();
};
