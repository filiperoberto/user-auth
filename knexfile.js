const databaseName = "userauth";

module.exports = {

    development : {
        client : 'mysql',
        connection : {
            host : '127.0.0.1',
            user : 'root',
            password : 'root',
            database : databaseName,
            charset: 'utf8'
        },
        migrations : {
            directory : __dirname + '/src/server/db/migrations'
        },
        seeds : {
            directory: __dirname + '/src/server/db/seeds'
        }
    },
    production : {
        client : 'mysql',
        connection : {
            host : '',
            user : '',
            password : '',
            database : '',
            charset: 'utf8'
        },
        migrations : {
            directory : __dirname + '/src/server/db/migrations'
        },
        seeds : {
            directory: __dirname + '/src/server/db/seeds'
        } 
    }
}