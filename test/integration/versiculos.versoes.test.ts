process.env.NODE_ENV = 'test';

import * as Knex from 'knex';
import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import app from '../../src/App';

const knex : Knex = require('../../src/server/db/Connection');
const should = chai.should();
const expect = chai.expect;

describe('routes : Versicles',() => {

    before(done => {
        knex.seed.run().then(() => done());
    });

    afterEach(() => {});

    describe('GET api/v1/versicles/ara',() => {

        it('responds with all versicles from ara version',done => {

            chai.request(app).get('/api/v1/versicles/ara')
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.have.length(5);
                    res.body[0].ver_texto.should.eql('No princípio criou Deus os céus e a terra.');
                    expect(res.body[0].vrs_id).to.be.eql(undefined);
                    done();
                })
        })
    })

    describe('GET api/v1/versicles/nvi',() => {

        it('responds with all versicles from nvi version',done => {

            chai.request(app).get('/api/v1/versicles/nvi')
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.have.length(3);
                    res.body[0].ver_texto.should.eql('No princípio Deus criou os céus e a terra.')
                    done();
                })
        })
    })

    describe('GET api/v1/versicles/ara/gn',() => {

        it('responds with all versicles from ara genesis',done => {

            chai.request(app).get('/api/v1/versicles/ara/gn')
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.have.length(4);
                    res.body[0].ver_texto.should.eql('No princípio criou Deus os céus e a terra.')
                    done();
                })
        })
    })

    describe('GET api/v1/versicles/ara/ex',() => {

        it('responds with all versicles from ara exodus',done => {

            chai.request(app).get('/api/v1/versicles/ara/ex')
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.have.length(1);
                    res.body[0].ver_texto.should.eql('Ora, estes são os nomes dos filhos de Israel, que entraram no Egito; entraram com Jacó, cada um com a sua família:')
                    done();
                })
        })
    })

    describe('GET api/v1/versicles/ara/gn/1',() => {

        it('responds with versicles from first chapter ara genesis',done => {

            chai.request(app).get('/api/v1/versicles/ara/gn/1')
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.have.length(3);
                    res.body[0].ver_texto.should.eql('No princípio criou Deus os céus e a terra.')
                    done();
                })
        })
    })

    describe('GET api/v1/versicles/ara/gn/2',() => {

        it('responds with versicles from second chapter ara genesis',done => {

            chai.request(app).get('/api/v1/versicles/ara/gn/2')
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.have.length(1);
                    res.body[0].ver_texto.should.eql('Foi-se um homem da casa de Levi e casou com uma filha de Levi.')
                    done();
                })
        })
    })

    describe('GET api/v1/versicles/ara/gn/1/1',() => {

        it('responds with versicles from first chapter first versicle ara genesis',done => {

            chai.request(app).get('/api/v1/versicles/ara/gn/1/1')
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.have.length(1);
                    res.body[0].ver_texto.should.eql('No princípio criou Deus os céus e a terra.')
                    done();
                })
        })
    })

    describe('GET api/v1/versicles/ara/gn/1/2',() => {

        it('responds with versicles from first chapter second versicle ara genesis',done => {

            chai.request(app).get('/api/v1/versicles/ara/gn/1/2')
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.have.length(1);
                    res.body[0].ver_texto.should.eql('A terra era sem forma e vazia; e havia trevas sobre a face do abismo, mas o Espírito de Deus pairava sobre a face das águas.')
                    done();
                })
        })
    })

    describe('GET api/v1/versicles/ara/gn/1/1-2',() => {

        it('responds with versicles from first chapter from first to second versicles ara genesis',done => {

            chai.request(app).get('/api/v1/versicles/ara/gn/1/1-2')
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.have.length(2);
                    res.body[0].ver_texto.should.eql('No princípio criou Deus os céus e a terra.')
                    res.body[1].ver_texto.should.eql('A terra era sem forma e vazia; e havia trevas sobre a face do abismo, mas o Espírito de Deus pairava sobre a face das águas.')
                    done();
                })
        })
    })

    describe('GET api/v1/versicles/ara/gn/1/1-',() => {

        it('responds with versicles from first chapter first versicle ara genesis',done => {

            chai.request(app).get('/api/v1/versicles/ara/gn/1/1-')
                .end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.have.length(1);
                    res.body[0].ver_texto.should.eql('No princípio criou Deus os céus e a terra.')
                    done();
                })
        })
    })

})