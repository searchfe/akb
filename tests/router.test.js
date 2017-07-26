/**
 * @file router.test
 * @author huanghuiquan (huanghuiquan@baidu.com)
 */

'use strict';

const request = require('supertest');
const Akb = require('../lib/akb');
const path = require('path');

describe('app router', function () {
    let akb = new Akb({appdir: path.resolve(__dirname, './fixtures/router')});
    akb.removeAllListeners('started');
    let server = akb.run();


    it('should match default route', function (done) {
        request(server)
            .get('/a/b')
            .expect(200)
            .expect('ab', done);
    });

    it('GET /testMethod should match GET method', function (done) {
        request(server)
            .get('/testMethod')
            .expect(200)
            .expect('ab', done);
    });

    it('POST /testMethod should match POST method', function (done) {
        request(server)
            .post('/testMethod')
            .expect(200)
            .expect('ac', done);
    });

    it('case 1: GET POST /testMutilMethod should match post methods', function (done) {
        request(server)
            .post('/testMutilMethod')
            .expect(200)
            .expect('ac', done);
    });

    it('case 2: GET POST /testMutilMethod should match get methods', function (done) {
        request(server)
            .get('/testMutilMethod')
            .expect(200)
            .expect('ac', done);
    });

    it('POST /testMethod should match POST method', function (done) {
        request(server)
            .post('/testMethod')
            .expect(200)
            .expect('ac', done);
    });

});
