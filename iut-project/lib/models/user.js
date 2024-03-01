'use strict';

const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');

module.exports = class User extends Model {

    static get tableName() {

        return 'user';
    }

    static get joiSchema() {
        return Joi.object({
            id: Joi.number().integer().greater(0),
            firstName: Joi.string().min(3).example('John').description('Firstname of the user'),
            lastName: Joi.string().min(3).example('Doe').description('Lastname of the user'),
            createdAt: Joi.date(),
            updatedAt: Joi.date(),
            role: Joi.string().valid('user', 'admin').default('user').description('Role of the user'),
            password: Joi.string().min(8).required().description('Password of the user'),
            mail: Joi.string().email().required().description('Email of the user'),
            username: Joi.string().required().description('Username of the user'),
        });
    }



    $beforeInsert(queryContext) {
        super.$beforeInsert(queryContext);
        this.role = 'user';
        this.updatedAt = new Date();
        this.createdAt = this.updatedAt;
    }

    $beforeUpdate(opt, queryContext) {

        this.updatedAt = new Date();
    }

};
