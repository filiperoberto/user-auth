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
                    expect(res.body).to.have.length(3);
                    expect(res.body[0]).to.have.property('nome');
                    expect(res.body[0]).to.have.property('citacoes');
                    res.body[0].nome.should.eql('Adãoo');
                    res.body[0].version_number.should.eql(2);
                    done();
                })
        })
    })

    describe('GET /api/v1/people/:id',() => {

        it('Should return person',done => {

            chai.request(app).get('/api/v1/people/1')
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(200);


                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('nome');
                    expect(res.body).to.have.property('citacoes');
                    res.body.nome.should.eql('Adãoo');
                    res.body.version_number.should.eql(2);
                    done();
                })
        })

        it('Should return person and parents',done => {

            chai.request(app).get('/api/v1/people/3')
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('nome');
                    expect(res.body).to.have.property('citacoes');
                    res.body.nome.should.eql('Sete');
                    expect(res.body).to.have.property('pai');
                    expect(res.body.pai).to.be.an('object');
                    res.body.pai.nome.should.eql('Adãoo');
                    res.body.version_number.should.eql(1);
                    done();
                })
        })
    })

})