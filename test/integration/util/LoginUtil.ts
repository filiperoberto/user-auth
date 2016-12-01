process.env.NODE_ENV = 'test';

import * as Knex from 'knex';
import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import app from '../../../src/App';

const should = chai.should();
const expect = chai.expect;


export class LoginUtil {

    public static login() : Promise<string> {
        return new Promise((resolve, reject) => {

            return chai.request(app).post('/api/v1/auth/login')
                .send({
                    username: 'filiperoberto.s@gmail.com',
                    password: '1234'
                })
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(200);
                    expect(res.body).to.have.property('token');
                    resolve(res.body.token);
                })
        })
    }

}