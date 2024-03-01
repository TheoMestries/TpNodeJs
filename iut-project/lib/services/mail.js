const nodemailer = require('nodemailer');
const { Service } = require('@hapipal/schmervice');
const amqp = require('amqplib');



class MailService extends Service {
    constructor(...args) {
        super(...args);

        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }


    async sendToQueue(queueName, message) {
        try {
            const connection = await amqp.connect('amqp://localhost');
            const channel = await connection.createChannel();
            await channel.assertQueue(queueName, { durable: false });
            channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
            console.log(" [x] Sent %s", message);

            await channel.close();
            await connection.close();
        } catch (error) {
            console.error("Error in sendToQueue:", error);
        }
    }

    async sendWelcomeEmail(email, userName) {
        const emailMessage = {
            type: 'welcomeEmail',
            email: email,
            userName: userName,
        };
        await this.sendToQueue('emailQueue', emailMessage);
    }
    async sendNewFilmNotification(film) {
        const emailMessage = {
            type: 'newFilmNotification',
            film: film
        };
        await this.sendToQueue('emailQueue', emailMessage);
    }

    async sendFilmUpdateNotification(oldFilm, newFilm) {
        const emailMessage = {
            type: 'filmUpdateNotification',
            oldFilm: oldFilm,
            newFilm: newFilm
        };
        await this.sendToQueue('emailQueue', emailMessage);
    }



}

module.exports = MailService;
