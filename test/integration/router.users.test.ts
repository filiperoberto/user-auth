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

describe('routes : Users',() => {

    let token : string;

    before(done => {

        knex.seed.run().then(() => {
            LoginUtil.login().then(t => {
                token = t;
                done();
            })
        });
    });

    describe('GET api/v1/users',() => {

        it('Should return all users without personal information',done => {

            chai.request(app).get('/api/v1/users')
                .send({
                    token : token
                })
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.have.length(2);
                    res.body[0].role.should.eql('admin');
                    res.body[0].name.should.eql('Filipe');
                    expect(res.body[0]).to.not.have.property('email');
                    expect(res.body[0]).to.not.have.property('password');
                    expect(res.body[0]).to.not.have.property('username');
                    done();
                })
        })

        it('Should fail authorization',done => {

            chai.request(app).get('/api/v1/users')
                .end((err, res) => {
                    should.exist(err);
                    res.should.have.status(403);
                    done();
                })
        })
    })

    describe('GET api/v1/users/:id',() => {

        it('Should get user 2',done => {

            chai.request(app).get('/api/v1/users/2')
                .send({
                    token : token
                })
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.have.length(1);
                    res.body[0].role.should.eql('editor');
                    res.body[0].name.should.eql('Yoda');
                    expect(res.body[0]).to.not.have.property('email');
                    expect(res.body[0]).to.not.have.property('password');
                    expect(res.body[0]).to.not.have.property('username');
                    done();
                })
        })

        it('Should return 404 when user does not exists',done => {
            chai.request(app).get('/api/v1/users/3')
                .send({
                    token : token
                })
                .end((err, res) => {
                    should.exist(err);
                    res.should.have.status(404);
                    done();
                })
        })

        it('Should get logged user',done => {

            chai.request(app).get('/api/v1/users/me')
                .send({
                    token : token
                })
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

    describe('POST api/v1/users',() => {

        it('Should accept post',done => {
            chai.request(app).post('/api/v1/users')
                .send({
                    name : 'Filipe Roberto',
                    website : "http://filiperoberto.com",
                    description : "AAA",
                    token : token
                })
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(201);
                    done();
                })
        })

        it('Values should have changed',done => {
            chai.request(app).get('/api/v1/users/me')
                .send({
                    token : token
                })
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(200);
                    res.body[0].name.should.eql('Filipe Roberto');
                    res.body[0].website.should.eql('http://filiperoberto.com');
                    res.body[0].description.should.eql('AAA');
                    res.body[0].modified.should.not.eql(null);
                    done();
                })
        })
    })

})