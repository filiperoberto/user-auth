process.env.NODE_ENV = 'test';

import * as Knex from 'knex';
import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import app from '../../src/App';

const knex : Knex = require('../../src/server/db/Connection');
const should = chai.should();
const expect = chai.expect;

describe('routes : Versions',() => {

    beforeEach(done => {
        /*return knex.migrate.rollback()
            .then(() => { return knex.migrate.latest(); })
            .then(() => { return knex.seed.run();  })*/
        knex.seed.run().then(() => done());
    });

    afterEach(() => {
        //return knex.migrate.rollback()
    });

    describe('GET api/v1/versions',() => {

        it('responds with JSON array', done => {

            chai.request(app).get('/api/v1/versions')
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.have.length(2);
                    done();
                })
        })
    })

    describe('GET api/v1/versions/:id',() => {

        it('responds with a version', done => {

            chai.request(app).get('/api/v1/versions/1')
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(200);
                    res.body.should.be.instanceof(Object);
                    res.body.vrs_nome.should.eql('ARA');
                    done();
                })
        })

        it('responds with 404 if no version found', done => {

            chai.request(app).get('/api/v1/versions/3')
                .end((err, res) => {
                    should.exist(err);
                    res.should.have.status(404);
                    done();
                })
        })

    })
})