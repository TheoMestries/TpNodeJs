'use strict';

const Joi = require('joi')
const Boom = require('@hapi/boom');
const Jwt = require('@hapi/jwt');


module.exports = [
    {
        method: 'post',
        path: '/user',
        options: {
            auth: false,
            tags: ['api'],
            validate: {
                payload: Joi.object({
                    firstName: Joi.string().required().min(3).example('John').description('Firstname of the user'),
                    lastName: Joi.string().required().min(3).example('Doe').description('Lastname of the user'),
                    username : Joi.string().required().example('TheTorky').description('Username of the user'),
                    mail: Joi.string().email().required().example('ExempleCool.test@cool.fr').description('Email of the user'),
                    password: Joi.string().required().min(8).example('Torky98745!').description('Password of the user')
                })
            }
        },
        handler: async (request, h) => {
            const { userService } = request.services();
            return await userService.create(request.payload);
        }
    },
    {
        method: 'GET',
        path: '/users',
        options: {
            auth: {
                scope: ['admin']
            },
            tags: ['api'],
            description: 'Get List of Users',
            notes: 'Returns a list of users'
        },
        handler: async (request, h) => {
            const { userService } = request.services();
            return await userService.findAll();
        }
    },
    {
        method: 'GET',
        path: '/user/{id}',
        options: {
            auth: {
                scope: ['user', 'admin']
            },
            tags: ['api'],
            description: 'Get a specific user by ID',
            notes: 'Returns a user',
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required().description('the id for the user')
                })
            }
        },
        handler: async (request, h) => {
            const { userService } = request.services();
            const id = request.params.id;

            return await userService.getById(id);
        }
    },
    {
        method: 'DELETE',
        path: '/user/{id}',
        options: {
            auth: {
                scope: ['admin']
            },
            tags: ['api'],
            description: 'Delete a user by ID',
            notes: 'Returns empty response on success',
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required().description('the id for the user')
                })
            }
        },
        handler: async (request, h) => {
            const { userService } = request.services();
            const id = request.params.id;

            await userService.delete(id);

            return '';
        }
    },
    {
        method: 'PATCH',
        path: '/user/{id}',
        options: {
            auth: {
                scope: ['admin']
            },
            tags: ['api'],
            description: 'Update a specific user',
            notes: 'Allows an admin to update details of a specific user',
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required().description('the id for the user')
                }),
                payload: Joi.object({
                    firstName: Joi.string().min(3),
                    lastName: Joi.string().min(3),
                    username: Joi.string(),
                    mail: Joi.string().email(),
                    role: Joi.string().valid('user', 'admin')
                })
            }
        },
        handler: async (request, h) => {
            const { userService } = request.services();
            const userId = request.params.id;
            const updateData = request.payload;

            return await userService.update(userId, updateData);
        }
    },
    {
        method: 'POST',
        path: '/user/login',
        options: {
            auth: false,
            tags: ['api'],
            validate: {
                payload: Joi.object({
                    mail: Joi.string().email().required().description('Email of the user'),
                    password: Joi.string().required().description('Password of the user')
                })
            }
        },
        handler: async (request, h) => {
            const { userService } = request.services();
            const { mail, password } = request.payload;

            const user = await userService.validateLogin(mail, password);

            if (user) {
                const token = Jwt.token.generate(
                    {
                        aud: 'urn:audience:iut',
                        iss: 'urn:issuer:iut',
                        mail: mail,
                        role: user.role,
                        id: user.id
                    },
                    {
                        key: 'random_string',
                        algorithm: 'HS512'
                    },
                    {
                        ttlSec: 14400
                    }
                );

                return { token };
            } else {
                return Boom.unauthorized('Invalid email or password');
            }
        }
    }
    ];
