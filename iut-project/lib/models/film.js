'use strict';

const Joi = require('joi');
const { Model  } = require('@hapipal/schwifty');

module.exports = class Film extends Model {

    static get tableName() {
        return 'film';
    }

    static get joiSchema() {
        return Joi.object({
            id: Joi.number().integer().greater(0),
            titre: Joi.string().required().example('Inception').description('Titre du film'),
            description: Joi.string().required().example('Un voleur qui s\'infiltre dans les rêves...').description('Description du film'),
            dateSortie: Joi.date().required().description('Date de sortie du film'),
            realisateur: Joi.string().required().example('Christopher Nolan').description('Réalisateur du film'),
            createdAt: Joi.date(),
            updatedAt: Joi.date()
        });
    }

    $beforeInsert(queryContext) {
        super.$beforeInsert(queryContext);
        this.updatedAt = new Date();
        this.createdAt = this.updatedAt;
    }

    $beforeUpdate(opt, queryContext) {
        this.updatedAt = new Date();
    }



};
