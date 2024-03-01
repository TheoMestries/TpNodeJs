const knexConfig = require('../../knexfile').development;
const knex = require('knex')(knexConfig);

exports.plugin = {
    name: 'DatabaseService',
    register: async (server, options) => {

        server.method('getUserEmails', async () => {
            return knex('users').select('email');
        });

        server.method('getUsers', async () => {
            return knex('users').select();
        });

        server.method('updateUserEmail', async (userId, newEmail) => {
            return knex('users').where({id: userId}).update({email: newEmail});
        });

    }
};
