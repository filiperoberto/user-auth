const databaseName = "genealogia";

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
    test : {
        client : 'mysql',
        connection : {
            host : '127.0.0.1',
            user : 'root',
            password : 'root',
            database : `${databaseName}_test`,
            charset: 'utf8'
        },
        migrations : {
            directory : __dirname + '/src/server/db/migrations'
        },
        seeds : {
            directory: __dirname + '/src/server/db/seeds_test'
        } 
    }
}