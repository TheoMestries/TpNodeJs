'use strict';

const Joi = require('joi')


module.exports = [
    {
        method: 'POST',
        path: '/film',
        options: {
            auth: {
                scope: ['admin']
            },
            tags: ['api'],
            validate: {
                payload: Joi.object({
                    titre: Joi.string().required().description('Titre du film'),
                    description: Joi.string().required().description('Description du film'),
                    dateSortie: Joi.date().required().description('Date de sortie du film'),
                    realisateur: Joi.string().required().description('Réalisateur du film')
                })
            }
        },
        handler: async (request, h) => {
            const { filmService } = request.services();
            return await filmService.create(request.payload);
        }
    },
    {
        method: 'GET',
        path: '/films',
        options: {
            auth: {
                scope: ['user', 'admin']
            },
            tags: ['api'],
            description: 'Get List of Films',
            notes: 'Returns a list of films'
        },
        handler: async (request, h) => {
            const { filmService } = request.services();
            return await filmService.findAll();
        }
    },
    {
        method: 'GET',
        path: '/film/{id}',
        options: {
            auth: {
                scope: ['user', 'admin']
            },
            tags: ['api'],
            description: 'Get a specific film by ID',
            notes: 'Returns a film',
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required().description('the id for the film')
                })
            }
        },
        handler: async (request, h) => {
            const { filmService } = request.services();
            const id = request.params.id;
            return await filmService.getById(id);
        }
    },
    {
        method: 'PATCH',
        path: '/film/{id}',
        options: {
            auth: {
                scope: ['admin']
            },
            tags: ['api'],
            description: 'Update a specific film',
            notes: 'Allows an admin to update details of a specific film',
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required().description('the id for the film')
                }),
                payload: Joi.object({
                    titre: Joi.string().description('Titre du film'),
                    description: Joi.string().description('Description du film'),
                    dateSortie: Joi.date().description('Date de sortie du film'),
                    realisateur: Joi.string().description('Réalisateur du film')
                })
            }
        },
        handler: async (request, h) => {
            const { filmService } = request.services();
            const filmId = request.params.id;
            const updateData = request.payload;
            return await filmService.update(filmId, updateData);
        }
    },
    {
        method: 'GET',
        path: '/films/export-csv',
        options: {
            auth: {
                strategy: 'jwt',
                scope: ['admin']
            },
            tags: ['api'],
            handler: async (request, h) => {

                const  id  = request.auth.credentials.id;
                const { userService } = request.services();
                const user = await userService.getById(id);
                const email = user.mail;
                console.log(email);
                const { exportService } = request.services();
                await exportService.initiateCsvExport(email);
                return h.response({ message: "La demande d'export CSV a été reçue. Un email vous sera envoyé." }).code(202);
            }
        }
    }
];

