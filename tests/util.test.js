/**
 * @file util test case
 * @author huanghuiquan (huanghuiquan@baidu.com)
 */

'use strict';

const util = require('../lib/util');
const path = require('path');

describe('util.isAbsolute(pathname)', function () {

    it('should return true for absolute paths', function () {
        util.isAbsolute(__dirname).should.equal(true);
        util.isAbsolute(__filename).should.equal(true);
        util.isAbsolute(path.join(process.cwd())).should.equal(true);
        util.isAbsolute(path.resolve(process.cwd(), 'README.md')).should.equal(true);
        util.isAbsolute('/foo/a/b/c/d').should.equal(true);
        util.isAbsolute('/foo').should.equal(true);
    });

    it('should return false for relative paths', function () {
        util.isAbsolute('a/b/c.js').should.equal(false);
        util.isAbsolute('./foo').should.equal(false);
        util.isAbsolute(path.relative(process.cwd(), 'README.md')).should.equal(false);
    });

    it('should work with glob patterns', function () {
        util.isAbsolute(path.join(process.cwd(), 'pages/*.txt')).should.equal(true);
        util.isAbsolute('pages/*.txt').should.equal(false);
    });

    it('should support windows', function () {
        util.isAbsolute('c:\\').should.equal(true);
        util.isAbsolute('a:foo/a/b/c/d').should.equal(false);
        util.isAbsolute(':\\').should.equal(false);
        util.isAbsolute('foo\\bar\\baz').should.equal(false);
        util.isAbsolute('foo\\bar\\baz\\').should.equal(false);
        util.isAbsolute('//C://user\\docs\\Letter.txt').should.equal(true);
        util.isAbsolute('\\\\unc\\share').should.equal(true);
        util.isAbsolute('\\\\unc\\share\\foo').should.equal(true);
        util.isAbsolute('\\\\unc\\share\\foo\\').should.equal(true);
    });

    it('should support windows unc', function () {
        util.isAbsolute('\\\\foo\\bar').should.equal(true);
        util.isAbsolute('//UNC//Server01//user//docs//Letter.txt').should.equal(true);
    });

    it('should support unices', function () {
        util.isAbsolute('/foo/bar').should.equal(true);
        util.isAbsolute('foo/bar').should.equal(false);
        util.isAbsolute('/user/docs/Letter.txt').should.equal(true);
    });

});

describe('util.resolve(root, pathname)', function () {

    it('should return original path for absolute path', function () {
        util.resolve('/name', '/foo/bar').should.eql('/foo/bar');
    });

    it('should return resolved path for relative path', function () {
        util.resolve('/name', 'foo/bar').should.eql('/name/foo/bar');
    });

});


describe('util.formater(str, data)', function () {

    it('should do nothing without match', function () {
        let str = 'akb next';
        util.formater(str, {}).should.eql(str);
    });

    it('should format string with value', function () {
        var data = {
            name: 'akb',
            version: 'next'
        };
        util.formater('this is {name}, it version is {version}', data)
            .should.eql('this is akb, it version is next');
    });

    it('should format string with undefined if value is empty', function () {
        var data = {
            name: 'akb'
        };
        util.formater('this is {name}, it version is {version}', data)
            .should.eql('this is akb, it version is undefined');
    });

});

describe('util.encodeHTML(html)', function () {

    it('converts & into &amp;', function () {
        util.encodeHTML('&').should.equal('&amp;');
    });

    it('converts " into &quot;', function () {
        util.encodeHTML('"').should.equal('&quot;');
    });

    it('converts \' into &#39;', function () {
        util.encodeHTML('\'').should.equal('&#39;');
    });

    it('converts < into &lt;', function () {
        util.encodeHTML('<').should.equal('&lt;');
    });

    it('converts > into &gt;', function () {
        util.encodeHTML('>').should.equal('&gt;');
    });

});

