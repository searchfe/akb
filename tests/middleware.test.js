/**
 * @file middleware test case
 * @author huanghuiquan (huanghuiquan@baidu.com)
 */

'use strict';

const request = require('supertest');
const Akb = require('../lib/akb');
const path = require('path');

describe('app middlewares', function () {

    let akb = new Akb({appdir: path.resolve(__dirname, './fixtures/middleware')});
    akb.removeAllListeners('started');
    let server = akb.run();

    it('should use middlewares', function (done) {
        request(server)
            .get('/')
            .expect(200)
            .expect('init|a', done);
    });
});

