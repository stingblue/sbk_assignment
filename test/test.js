'use strict';

var sinon = require('sinon');
var expect = require('chai').expect;
var rulesCheck = require('../index');
var assert = require('chai').assert;
var fs = require('fs');

describe('#handleHtmlFile()', function() {
	
	it('it should return filename when outputtype is file', function(done) {
		rulesCheck.handleHtmlFile('contents.html', 'file', 'test2.txt', function(data) {
			expect(data).to.equal('test2.txt');
			done();
		});
	});

	it('it should return data:', function(done) {
		rulesCheck.handleHtmlFile('contents.html', 'test', '', function(data) {
			var expected = "There are 2 <img> tag without alt attribute\n" +
			"There are 1 <a> tag without rel attribute\n" +
			"There are 0 <head> doesn't have <title> tag\n" +
			"There are 0 <head> doesn't have <meta> tag with name=descriptions\n" +
			"There are 1 <head> doesn't have <meta> tag with name=keywords\n" +
			"This HTML not have more than 15 <strong> tag\n" +
			"This HTML have more than 1 <h1> tag\n";
			expect(data).to.equal(expected);
			done();
		});
	});
});

describe('#handleReadableStream()', function() {
	var stream = require('stream');
	
	var r = 'test';

	it('it should return filename when outputtype is file', function(done) {
		r = new stream.Readable;
		r.setEncoding('UTF8');
		r.push('<html><head><meta name="descriptions"></head>');
		r.push('<img id ="test"/>');
		r.push('<a>a1</a><a>a2</a><a rel="rel1">a3</a>');
		r.push('<h1>h1</h1><h1>h11</h1></html>');
		r.push(null);
		rulesCheck.handleReadableStream(r, 'file', 'test.txt', function(data) {
			expect(data).to.equal('test.txt');
			done();
		});
	});
	
	
	it('it should return data:', function(done) {
		r = new stream.Readable;
		r.setEncoding('UTF8');
		r.push('<html><head><meta name="descriptions"></head>');
		r.push('<img id ="test"/></html>');
		r.push(null);
		rulesCheck.handleReadableStream(r, 'test', '', function(data) {
			var expected = "There are 1 <img> tag without alt attribute\n" +
			"There are 0 <a> tag without rel attribute\n" +
			"There are 1 <head> doesn't have <title> tag\n" +
			"There are 0 <head> doesn't have <meta> tag with name=descriptions\n" +
			"There are 1 <head> doesn't have <meta> tag with name=keywords\n" +
			"This HTML not have more than 15 <strong> tag\n" +
			"This HTML not have more than 1 <h1> tag\n";
			expect(data).to.equal(expected);
			done();
		});
		
	});

	it('it should return data:', function(done) {
		r = new stream.Readable;
		r.setEncoding('UTF8');
		r.push('<html><head><meta name="descriptions"></head>');
		r.push('<img id ="test"/>');
		r.push('<a>a1</a><a>a2</a><a rel="rel1">a3</a>');
		r.push('<strong>s</strong><strong>s</strong><strong>s</strong><strong>s</strong><strong>s</strong><strong>s</strong>');
		r.push('<strong>s</strong><strong>s</strong><strong>s</strong><strong>s</strong><strong>s</strong><strong>s</strong>');
		r.push('<strong>s</strong><strong>s</strong><strong>s</strong><strong>s</strong><strong>s</strong><strong>s</strong>');
		r.push('<h1>h1</h1><h1>h11</h1></html>');
		r.push(null);
		rulesCheck.handleReadableStream(r, 'test', '', function(data) {
			var expected = "There are 1 <img> tag without alt attribute\n" +
			"There are 2 <a> tag without rel attribute\n" +
			"There are 1 <head> doesn't have <title> tag\n" +
			"There are 0 <head> doesn't have <meta> tag with name=descriptions\n" +
			"There are 1 <head> doesn't have <meta> tag with name=keywords\n" +
			"This HTML have more than 15 <strong> tag\n" +
			"This HTML have more than 1 <h1> tag\n";
			expect(data).to.equal(expected);
			done();	
		});
	});
	
	it('it should return data:', function(done) {
		var readerStream = fs.createReadStream('stream_test.txt');
		rulesCheck.handleReadableStream(readerStream, 'test', '', function(data) {
			var expected = "There are 3 <img> tag without alt attribute\n" +
			"There are 1 <a> tag without rel attribute\n" +
			"There are 1 <head> doesn't have <title> tag\n" +
			"There are 1 <head> doesn't have <meta> tag with name=descriptions\n" +
			"There are 1 <head> doesn't have <meta> tag with name=keywords\n" +
			"This HTML not have more than 15 <strong> tag\n" +
			"This HTML have more than 1 <h1> tag\n";
			expect(data).to.equal(expected);
			done();	
		});
	});
});