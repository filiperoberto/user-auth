process.env.NODE_ENV = 'test';

import * as Knex from 'knex';
import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import app from '../../src/App';

const knex : Knex = require('../Connection');
const should = chai.should();
const expect = chai.expect;

describe('routes : Versions',() => {

    beforeEach(() => {
        /*return knex.migrate.rollback()
            .then(() => { return knex.migrate.latest(); })
            .then(() => { return knex.seed.run();  })*/
        knex.seed.run();
    });

    afterEach(() => {
        //return knex.migrate.rollback()
    });

    describe('GET api/v1/versions',() => {

        it('responds with JSON array', done => {

            chai.request(app).get('api/v1/versions')
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.have.length(5);
                    done();
                })
        })
    })
})