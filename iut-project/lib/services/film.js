'use strict';

const Schmervice = require('@hapipal/schmervice');
const Boom = require('@hapi/boom');

module.exports = class FilmService extends Schmervice.Service {


    async create(filmData) {
        const { Film } = this.server.models();
        const {mailService} = this.server.services();
        const film = await Film.query().insertAndFetch(filmData);
        await mailService.sendNewFilmNotification(film);

        return film;

    }

    async findAll() {
        const { Film } = this.server.models();

        try {
            const films = await Film.query();
            return films;
        } catch (error) {
            throw Boom.badRequest('Erreur lors de la récupération des films', error);
        }
    }


    async getById(id) {
        const { Film } = this.server.models();

        try {
            const film = await Film.query().findById(id);
            if (!film) {
                throw Boom.notFound('Film non trouvé');
            }
            return film;
        } catch (error) {
            throw Boom.badRequest('Erreur lors de la récupération du film', error);
        }
    }

    async getFilmById(filmId) {
        const { Film } = this.server.models();
        const film = await Film.query().findById(filmId);
        if (!film) {
            throw Boom.notFound('Film non trouvé');
        }
        return film;
    }

    async update(id, updateData) {
        const {mailService} = this.server.services();
        const { Film } = this.server.models();

        try {
            const oldFilm = await this.getFilmById(id);
            const film = await Film.query().patchAndFetchById(id, updateData);
            if (!film) {
                throw Boom.notFound('Film non trouvé');
            }
            await mailService.sendFilmUpdateNotification(oldFilm,film);
            return film;
        } catch (error) {
            return error;
        }
    }


};
