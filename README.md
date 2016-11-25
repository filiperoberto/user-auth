# Genealogia Biblica API

### Creating a migration: ###

```
#!cmd
knex migrate:make setup
```
### To apply your new migration: ###


```
#!cmd
knex migrate:latest
```
### To make a change to your tables ###


```
#!cmd
knex migrate:make step1
```

### Rollback ###

```
#!cmd
knex migrate:rollback
```