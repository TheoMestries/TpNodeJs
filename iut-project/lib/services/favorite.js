const Boom = require('@hapi/boom');
const {Service} = require("@hapipal/schmervice");


module.exports = class FavoriteService extends Service {

    async addFavorite(userId, filmId) {
        const { Favorite } = this.server.models();

        const existingFavorite = await Favorite.query().findOne({ user_id: userId, film_id: filmId });

        if (existingFavorite) {
            throw Boom.badRequest('Ce film est déjà dans vos favoris.');
        }

        const favorite = await Favorite.query().insert({
            user_id: userId,
            film_id: filmId
        });

        return favorite;
    }



    async removeFavorite(userId, filmId) {
        const {Favorite} = this.server.models();
        const favorite = await Favorite.query()
            .where({ user_id: userId, film_id: filmId });

        if (favorite.length === 0) {
            throw Boom.notFound('Ce film n\'est pas dans vos favoris');
        }

        return Favorite.query()
            .delete()
            .where({user_id: userId, film_id: filmId});
    }

    async getFavorites(userId) {
        const {Favorite} = this.server.models();
        const favorites = await Favorite.query()
            .where('user_id', userId)
            .withGraphFetched('film');

        return favorites;
    }
}
