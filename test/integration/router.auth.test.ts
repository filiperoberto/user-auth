process.env.NODE_ENV = 'test';

import * as Knex from 'knex';
import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import app from '../../src/App';

const knex : Knex = require('../../src/server/db/Connection');
const should = chai.should();
const expect = chai.expect;

describe('routes : Auth',() => {

    before(done => {
        knex.seed.run().then(() => done());
    });

    //afterEach(() => {});

    describe('POST /api/v1/auth/login',() => {

        it('Should successfuly login',done => {

            chai.request(app).post('/api/v1/auth/login')
                .send({
                    username: 'filiperoberto.s@gmail.com',
                    password: '1234'
                })
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(200);
                    expect(res.body).to.have.property('token');
                    done();
                })
        })

        it('Should fail login with wrong password',done => {

            chai.request(app).post('/api/v1/auth/login')
                .send({
                    username: 'filiperoberto.s@gmail.com',
                    password: '12345'
                })
                .end((err, res) => {
                    should.exist(err);
                    res.should.have.status(401);
                    done();
                })
        })
    })

    describe('POST /api/v1/auth/register',() => {

        it('Should successfuly create user and return token',done => {

            chai.request(app).post('/api/v1/auth/register')
                .send({
                    username: 'filipesilva@outlook.com',
                    password: '12345'
                })
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(201);
                    expect(res.body).to.have.property('token');
                    done();
                })
        })

        it('Should successfuly login after register',done => {

            chai.request(app).post('/api/v1/auth/login')
                .send({
                    username: 'filipesilva@outlook.com',
                    password: '12345'
                })
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(200);
                    expect(res.body).to.have.property('token');
                    done();
                })
        })

    })

})