'use strict';

var expect = require('chai').expect;
var rulesCheck = require('../index');

describe('#rulesCheck', function() {
    it('should ', function() {
        var result = rulesCheck.handleHtmlFile('contents.html', 'console');
		//var config = rulesCheck.getConfig();
		//config.img = [{'name': 'test22'}];
		//rulesCheck.setConfig(config);
		//var config2 = rulesCheck.getConfig();
        expect(result).to.equal('1');
    });
	
	it('should ', function() {
		var stream = require('stream');

		var r = new stream.Readable;
		r.setEncoding('UTF8');
		r.push('<title>Title<title>');// the string you want
		r.push('ttttt');
		r.push(null);
        //var result = rulesCheck.handleReadableStream(r, 'console');
        //expect(result).to.equal('1');
    });
});