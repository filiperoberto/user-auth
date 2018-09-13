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
    production : {
        client : 'mysql',
        connection : {
            host : 'mysql.mapadareforma.com.br',
            user : 'mapadareforma02',
            password : 'ejzsMNQmD7Dyhe78',
            database : 'mapadareforma02',
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