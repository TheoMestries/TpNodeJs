'use strict';

const Joi = require('joi')


module.exports = [
    {
        method: 'POST',
        path: '/favorites',
        options: {
            tags: ['api', 'favorites'],

            auth: {
                scope: ['user', 'admin']
            },
            validate: {
                payload: Joi.object({
                    filmId: Joi.number().integer().required().description('ID du film à ajouter aux favoris')
                })
            }
        },
        handler: async (request, h) => {
            const userId = request.auth.credentials.id;
            const { filmId } = request.payload;
            return await request.services().favoriteService.addFavorite(userId, filmId);
        }
    },
    {
        method: 'DELETE',
        path: '/favorites/{filmId}',
        options: {
            tags: ['api', 'favorites'],

            auth: {
                scope: ['user' , 'admin']
            },
            validate: {
                params: Joi.object({
                    filmId: Joi.number().integer().required().description('ID du film à supprimer des favoris')
                })
            }
        },
        handler: async (request, h) => {
            const userId = request.auth.credentials.id;
            const filmId  = request.params.filmId;
            return await request.services().favoriteService.removeFavorite(userId, filmId);
        }
    },
    {
        method: 'GET',
        path: '/favorites',
        options: {
            tags: ['api', 'favorites'],

            auth: {
                scope: ['user' , 'admin']
            }
        },
        handler: async (request, h) => {
            const userId = request.auth.credentials.id;
            return await request.services().favoriteService.getFavorites(userId);
        }
    }
];

