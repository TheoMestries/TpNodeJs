
const { Model } = require('objection');

class Favorite extends Model {
    static get tableName() {
        return 'favorites';
    }

    static get relationMappings() {
        const User = require('./User');
        const Film = require('./Film');

        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'favorites.user_id',
                    to: 'user.id'
                }
            },
            film: {
                relation: Model.BelongsToOneRelation,
                modelClass: Film,
                join: {
                    from: 'favorites.film_id',
                    to: 'film.id'
                }
            }
        };
    }
}

module.exports = Favorite;
