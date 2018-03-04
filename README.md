Rules Check(HTML file)
=========

A small library that scan 1 html and output validation

## Installation

  `npm install sbk_assignment`

## Usage

    var rulesCheck = require('sbk_assignment');

	
	==============================================
	#When input is html file
	#handleHtmlFile(filepath, outputType, outputPath, callback)
	#outputType => 'file' || 'console' || 'writableStream'
	
	Example:
	rulesCheck.handleHtmlFile("contents.html", "file", "output.txt")
	==============================================
	# GET Writable stream data
	rulesCheck.handleHtmlFile("contents.html", "writableStream", "", function(stream) {
		//do here;
	});
	
	==============================================
	#When input is ReadableStream
	#handleReadableStream(ReadableStream, outputType, outputPath, callback)
	#outputType => 'file' || 'console' || 'writableStream'
	Example:
	var fs = require('fs');
	var data = '';

	// Create a readable stream from file
	var readerStream = fs.createReadStream('stream_test.txt');
	rulesCheck.handleReadableStream(readerStream, 'console')
	
	//Or create a readable stream from code
	var stream = require('stream');
	var r = new stream.Readable;
	r.setEncoding('UTF8');
	r.push('<html><title>Title');// the string you want
	r.push('</title></html>');
	r.push(null);
	rulesCheck.handleReadableStream(r, 'file', 'output.txt');
    
	==============================================
	CONFIG Example: 
	1. Check without
	img:[
		{
			attribute: 'alt',
		    check: 'without'
		}
	]
	2. Check exists
	img:[
		{
			attribute: 'name',
		    value: 'beautiful',
		    check: 'exists'
		}
	],
	3. Check contain
	a:[
		{
			children: 'span',
			check: 'contain'
		},
		{
			children: 'div',
			attribute: 'name',
			value: 'descriptions',
			check: 'contain'
		}
	]
	
	4. Check greater
	strong: [{
		check: 'greater',
		value: 15
	}]
	
	==============================================
	#SET NEW config
	
	var config = {a: [{attribute:'name', 'value': 'a1', 'check': 'exists'}], h1: [{'check': 'greater', 'value': 1}], img: [{'attribute': 'alt', 'check': 'without'}]};
	rulesCheck.setConfig(config);
	------------------
	#MODIFY exists config

	var config = rulesCheck.getConfig();
	config.img = [{'attribute': 'alt', 'check': 'exists'}];
	rulesCheck.setConfig(config);

## Tests
	
   git clone https://github.com/stingblue/sbk_assignment.git
   
   npm install mocha
   
   npm install chai
   
   npm install sinon
   
   npm install cheerio
 
   npm test
