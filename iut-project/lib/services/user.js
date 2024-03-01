'use strict';

const { Service } = require('@hapipal/schmervice');
const Encrypt = require('@theom19/iut-encrypt');


module.exports = class UserService extends Service {

    async create(user){
        const { User } = this.server.models();
        const {mailService} = this.server.services();

        if (user.password) {
            user.password = Encrypt.sha1(user.password);
        }

        await mailService.sendWelcomeEmail(user.mail, user.firstName);

        return User.query().insertAndFetch(user);
    }
    async getById(id) {
        const { User } = this.server.models();

        return User.query().findById(id);
    }

    async findAll(){
        const { User } = this.server.models();
        return User.query();
    }

    async delete(id){
        const { User } = this.server.models();

        const numDeleted = await User.query().deleteById(id);

        return numDeleted;
    }

    async update(id, updateData) {
        const { User } = this.server.models();

        const existingUser = await User.query().findById(id);
        if (!existingUser) {
            throw Boom.notFound(`User not found with id ${id}`);
        }

        if (updateData.password) {
            updateData.password = Encrypt.sha1(updateData.password);
        }

        return User.query().patchAndFetchById(id, updateData);
    }

    async validateLogin(mail, password) {
        const { User } = this.server.models();
        const user = await User.query().findOne({ mail });

        if (!user) {
            return null;
        }

        const passwordHash = Encrypt.sha1(password);
        if (user.password === passwordHash) {
            return user;
        } else {
            return null;
        }
    }
}
