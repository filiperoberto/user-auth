# User Auth

A simple rest API with jwt auth. It uses express and knexjs to database access.


### Installing: ###

```
#!cmd
npm install
```

### To create user table: ###
```
#!cmd
npm install -g knex
knex migrate:latest
```
### Populate user table: ###
```
#!cmd
knex seed:run
```

### To build application: ###

```
#!cmd
gulp build
```
### Start Application ###

```
#!cmd
npm start
```

### To test ###

```
#!cmd
npm test
```