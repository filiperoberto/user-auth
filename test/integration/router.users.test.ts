process.env.NODE_ENV = 'test';

import * as Knex from 'knex';
import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import app from '../../src/App';

const knex : Knex = require('../../src/server/db/Connection');
const should = chai.should();
const expect = chai.expect;

describe('routes : Users',() => {

    before(done => {
        knex.seed.run().then(() => done());
    });

    //afterEach(() => {});

    describe('GET api/v1/users',() => {

        it('Should return all users without personal information',done => {

            chai.request(app).get('/api/v1/users')
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.have.length(1);
                    res.body[0].role.should.eql('admin');
                    res.body[0].name.should.eql('Filipe');
                    expect(res.body[0]).to.not.have.property('email');
                    expect(res.body[0]).to.not.have.property('password');
                    expect(res.body[0]).to.not.have.property('username');
                    done();
                })
        })

    })

})