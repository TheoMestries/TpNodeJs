const amqp = require('amqplib');
const nodemailer = require('nodemailer');
const knexConfig = require('./knexfile').development;
const { stringify } = require('csv-stringify');
const knex = require('knex')(require('./knexfile').development);

const { parse } = require('json2csv');

async function sendCSVEmail(email, csv) {
    const mailOptions = {
        from: '"Admin" <admin@example.com>',
        to: email,
        subject: "Export des films",
        text: "Veuillez trouver ci-joint l'export des films.",
        attachments: [
            {
                filename: 'export_films.csv',
                content: csv,
            },
        ],
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email d'export CSV envoyé à ${email}`);
}


const { promisify } = require('util');
const stringifyAsync = promisify(stringify);

async function generateCSV() {
    const films = await knex('film').select('*');
    const columns = {
        id: 'ID',
        titre: 'Titre',
        description: 'Description',
        dateSortie: 'Date de Sortie',
        realisateur: 'Réalisateur',
        createdAt: 'Date de création',
        updatedAt: 'Date de modification',
    };

    const options = {
        header: true,
        columns: columns,
    };

    try {
        return await stringifyAsync(films, options);
    } catch (error) {
        console.error('Erreur lors de la génération du CSV :', error);
        throw error;
    }
}



const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
        user: "nayeli.reinger40@ethereal.email",
        pass: "V42mAg7zQuWjMEsSrV",
    },
});

async function getUsers() {
    return knex('user').select();
}





async function getFavoritesUsers(filmId) {
    return knex('user')
        .join('favorites', 'user.id', 'favorites.user_id')
        .where('favorites.film_id', filmId)
        .select('user.mail');
}


async function startConsumer() {
    let connection = await amqp.connect('amqp://localhost');
    let channel = await connection.createChannel();

    await channel.assertQueue('emailQueue', { durable: false });
    await channel.assertQueue('exportQueue', { durable: false });

    console.log(" [*] Waiting for messages in 'emailQueue'. To exit press CTRL+C");

    channel.consume('emailQueue', async (message) => {
        if (message !== null) {
            console.log(" [x] Received %s", message.content.toString());
            const emailData = JSON.parse(message.content.toString());
            console.log(emailData);

            switch(emailData.type) {
                case 'welcomeEmail':
                    await sendWelcomeEmail(emailData.email, emailData.userName);
                    break;
                case 'newFilmNotification':
                    await sendNewFilmNotification(emailData);
                    break;
                case 'filmUpdateNotification':
                    await sendFilmUpdateNotification(emailData);
                    break;
                default:
                    console.log("Type de message non reconnu");
            }

            channel.ack(message);
        }
    });

    channel.consume('exportQueue', async (message) => {
        if (message !== null) {
            console.log(" [x] Received %s", message.content.toString());
            const exportData = JSON.parse(message.content.toString());
            console.log(exportData);

            if (exportData.type === 'exportCsv') {
                const csv = await generateCSV();
                console.log(exportData.email);
                if (exportData.email)
                await sendCSVEmail(exportData.email, csv);
            }

            channel.ack(message);
        }
    });
}



async function sendWelcomeEmail( email, userName ) {
    const mailOptions = {
        from: '"Bienvenue" <bienvenue@exemple.com>',
        to: email,
        subject: "Bienvenue sur notre platefdsqqdsorme",
        text: `Bonjour ${userName}, bienvenue sur notre plateforme.`,
        html: `<strong>Bonjour ${userName},</strong><p>bienvenue sur notre plateforme.</p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email de bienvenue envoyé à ${email}`);
}

async function sendNewFilmNotification(filmData) {
    const users = await getUsers();
    console.log(users);

    for (const user of users) {
        const mailOptions = {
            from: '"Notifications" <notifications@exemple.com>',
            to: user.mail,
            subject: `Nouveau film ajouté : ${filmData.film.titre}`, // Correction ici
            text: `Un nouveau film a été ajouté : ${filmData.film.titre}.\nDescription : ${filmData.film.description}\nDate de sortie : ${filmData.film.dateSortie}\nRéalisateur : ${filmData.film.realisateur}`,
            html: `<h1>Nouveau film ajouté : ${filmData.film.titre}</h1><p>Description : ${filmData.film.description}</p><p>Date de sortie : ${filmData.film.dateSortie}</p><p>Réalisateur : ${filmData.film.realisateur}</p>`,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Notification de nouveau film envoyée à ${user.mail}`);
    }
}




async function sendFilmUpdateNotification({ oldFilm, newFilm }) {
    const favoritesUsers = await getFavoritesUsers(oldFilm.id);

    for (const user of favoritesUsers) {
        let changes = [];
        if (oldFilm.titre !== newFilm.titre) changes.push(`Titre: de "${oldFilm.titre}" à "${newFilm.titre}"`);
        if (oldFilm.description !== newFilm.description) changes.push(`Description: de "${oldFilm.description}" à "${newFilm.description}"`);


        const mailOptions = {
            from: '"Mises à jour" <updates@exemple.com>',
            to: user.mail,
            subject: `Mise à jour du film : ${newFilm.titre}`,
            text: `Le film "${oldFilm.titre}" a été mis à jour.\n\nModifications :\n${changes.join('\n')}`,
            html: `<h1>Mise à jour du film : ${newFilm.titre}</h1><p>Modifications :</p><ul>${changes.map(change => `<li>${change}</li>`).join('')}</ul>`,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Notification de mise à jour envoyée à ${user.mail}`);
    }
}


startConsumer().catch(console.error);
