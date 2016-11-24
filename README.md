# Genealogia Biblica API

## Creaqting a migration:

knex migrate:make setup

To apply your new migration : 

knex migrate:latest

To make a change to your tables

knex migrate:make step1

Rollback
knex migrate:rollback 