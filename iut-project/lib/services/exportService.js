const amqp = require('amqplib');

class ExportService {
    async initiateCsvExport(adminEmail) {
        const message = JSON.stringify({
            type: 'exportCsv',
            email: adminEmail
        });

        let connection = await amqp.connect('amqp://localhost');
        let channel = await connection.createChannel();
        await channel.assertQueue('exportQueue', { durable: false });
        channel.sendToQueue('exportQueue', Buffer.from(message));
        console.log(" [x] Requête d'export CSV envoyée.");

        await channel.close();
        await connection.close();
    }
}

module.exports = ExportService;
