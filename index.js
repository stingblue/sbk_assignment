'use strict';

var rules_config = {
	img:[
		{
			attribute: 'alt',
		    check: 'without'
		}
	],
	a: [{
		attribute: 'rel',
		check: 'without'
	}],
	head:[
		{
			children: 'title',
			check: 'contain'
		},
		{
			children: 'meta',
			attribute: 'name',
			value: 'descriptions',
			check: 'contain'
		},
		{
			children: 'meta',
			attribute: 'name',
			value: 'keywords',
			check: 'contain'
		}
	],
	strong: [{
		check: 'greater',
		value: 15
	}],
	h1: [{
		check: 'greater',
		value: 1
	}]
}

/**
 * Check html SEO
 */
module.exports = {
	handleHtmlFile: handleHtmlFile,
	handleReadableStream: handleReadableStream,
    setConfig: setConfig,
	getConfig: getConfig
};

/**
 * Set rules config
 * @param {object} config
 * @return
 */
function setConfig(config) {
	rules_config = config;
	return true;
}

/**
 * Get rules config
 * @return {object}
 */
function getConfig() {
	return rules_config;
}

/**
 * Output Html detect following rules
 * @param {string} data
 * @return {string}
 */
function checkRules(data) {
	var res = '';
	const cheerio = require('cheerio');
	const $ = cheerio.load(data);

	for(var tag in rules_config) {
		var tag_config = rules_config[tag];
		if (typeof tag_config.length != "undefined") {
			for (var j = 0; j < tag_config.length;j++) {
				var obj = tag_config[j];
				var value = obj.value;
				var check = obj.check;
				
				if(typeof obj.attribute != "undefined") {
					var attribute = obj.attribute;
					
					var dom = check == 'without' ? tag + ":not([" + attribute : tag + "[" + attribute;
					var tag_msg = '<' + tag + '>';
					if(typeof obj.children != "undefined") {
						dom = check == 'without' ? tag + " "  + obj.children + ":not([" + attribute : tag + " "  + obj.children + "[" + attribute;
						tag_msg = '<' + obj.children + '>';
					}
					
					if(typeof value != "undefined") {
						dom += check == 'without' ? "=" + value + "])" : "=" + value + "]";
					}
					else {
						dom += check == 'without' ? "])" : "]";
					}

					var count_match = $(dom).length;
					switch(check) {
						case "without":
							if(typeof value != "undefined") {
								res += "There are " + count_match + " " + tag_msg + " tag without " + attribute + " attribute value equals " + value + "\n";
							}
							else {
								res += "There are " + count_match + " " + tag_msg + " tag without " + attribute + " attribute\n";
							}
							break;
						case "exists":
							if(count_match > 0) {
								res += "This HTML exists " + tag_msg + " tag";
							}
							else {
								res += "This HTML without " + tag_msg + " tag";
							}
							if(typeof value != "undefined") {
								res += " with " + attribute + "=" + value + "\n";
							}
							else {
								res += " with " + attribute + " attribute\n";
							}
							break;
						case "contain":
							var parent_count = $(tag).length;
							var count = parent_count - count_match;
							if(typeof value != "undefined") {
								res += "There are " + count + " <" + tag + "> doesn't have " + tag_msg + " tag with " + attribute + "=" + value + "\n";
							}
							else {
								res += "There are " + count + " <" + tag + "> doesn't have " + tag_msg + " tag with " + attribute + " attribute\n";
							}
							
							break;
						case "greater":
							if (count_match > value) {
								res += "This HTML have more than " + count_match + " <" + tag + "> tag\n";
							}
							else {
								res += "This HTML not have more than " + count_match + " <" + tag + "> tag\n";
							}	
							
							break;
						default:
							res += "This " + " <" + tag + "> tag have invalid setting\n";
					}
				}
				else {
					var dom = tag;
					var tag_msg = '<' + tag + '>';
					if(typeof obj.children != "undefined") {
						dom = tag + " "  + obj.children;
						tag_msg = '<' + obj.children + '>';
					}
					var count_match = $(dom).length;
					switch(check) {
						case "without":
						case "exists":
							if(count_match > 0) {
								res += "This HTML exists " + tag_msg + " tag\n";
							}
							else {
								res += "This HTML without " + tag_msg + " tag\n";
							}
							
							break;
						case "contain":
							var parent_count = $(tag).length;
							var count = parent_count - count_match;
							res += "There are " + count + " <" + tag + "> doesn't have " + tag_msg + " tag\n";
							break;
						case "greater":
							if (count_match > value) {
								res += "This HTML have more than " + value + " <" + tag + "> tag\n";
							}
							else {
								res += "This HTML not have more than " + value + " <" + tag + "> tag\n";
							}	
							
							break;
						default:
							res += "This " + " <" + tag + "> tag have invalid setting\n";
					}
					
				}
			}
			
		}
	}

	return res;
}

/**
 * Handle result string
 * @param {string} outputType
 * @param {string} response
 * @param {string} outputPath
 * @return {mix}
 */
function outputResponse(outputType, response, outputPath) {
	if(outputType == 'file') {
		var filename = typeof outputPath != 'undefined' ? outputPath : 'output.txt';
		var fs = require('fs');
		fs.writeFile(filename, response, function(err) {
			console.log('Written content to ' + filename);
		});
		return filename;
	}
	else if(outputType == 'writableStream') {
		stream = require('stream');
		var ws = new stream.Writable({
		  write: function(chunk, encoding, callback) {
			//console.log(chunk.toString());
			callback();
		  }
		});
		ws.write(response);
		//ws.end();
		return ws;
	}
	else if(outputType == 'test') {
		return response;
	}
	//Default: console
	console.log(response);
}

/**
 * Handle html file
 * @param {string} filepath
 * @param {string} outputType
 * @param {string} outputPath
 * @param {object} callback
 * @return {mix}
 */
function handleHtmlFile (filepath, outputType, outputPath, callback) {
	var fs = require('fs');
	fs.readFile(filepath, 'utf8', function(err, data) {
		var response = checkRules(data);
		var output = outputResponse(outputType, response, outputPath);
		if (typeof callback != 'undefined'){
			return callback(output);
		}	
	});
}

/**
 * Handle readableStream file
 * @param {string} readerStream
 * @param {string} outputType
 * @param {string} outputPath
 * @param {object} callback
 * @return {mix}
 */
function handleReadableStream(readerStream, outputType, outputPath, callback) {
	// Set the encoding to be utf8. 
	readerStream.setEncoding('UTF8');
	
	var data = '';

	readerStream.on('data', function(chunk) {
		data+=chunk;
	});

	// Handle stream events --> data, end, and error
	readerStream.on('end', function() {
		var response = checkRules(data);
	    var output = outputResponse(outputType, response, outputPath);
		if (typeof callback != 'undefined'){
			return callback(output);
		}	 
	});
}