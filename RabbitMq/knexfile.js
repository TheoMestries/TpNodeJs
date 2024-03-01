
module.exports = {
    development: {
        client     : 'mysql',
        connection : {
            host     : process.env.DB_HOST || '0.0.0.0',
            user     : process.env.DB_USER || 'root',
            password : process.env.DB_PASSWORD || 'hapi',
            database : process.env.DB_DATABASE || 'user'
        }
    }
};
