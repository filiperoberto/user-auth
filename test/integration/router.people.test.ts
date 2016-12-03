process.env.NODE_ENV = 'test';

import * as Knex from 'knex';
import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import {LoginUtil} from './util/LoginUtil'

import app from '../../src/App';

const knex : Knex = require('../../src/server/db/Connection');
const should = chai.should();
const expect = chai.expect;

describe('routes : Tags',() => {

    let token : string;

    before(done => {

        knex.seed.run().then(() => {
            LoginUtil.login().then(t => {
                token = t;
                done();
            })
        });
    });

    describe('GET /api/v1/people',() => {

        it('Should return all people',done => {

            chai.request(app).get('/api/v1/people')
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.have.length(2);
                    //res.body[0].texto.should.eql('Cadastro');
                    //res.body[1].texto.should.eql('Dica');
                    done();
                })
        })
    })

})