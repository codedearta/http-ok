const assert = require('assert');
const http = require('http');
const HttpOk = require('../src/http_ok.js');

describe('http-ok.', function() {
	// let httpServer
	//
	// before(() => {
	// 	httpServer = http.createServer((request, response) => {
	// 		response.write('blah');
	// 		response.end();
	// 	}).listen(12344);
	// });

  it('get() should return a promise and resolved when statusCode is 200', function(done) {
		let client = new HttpOk('http://www.nzz.ch');
		client.get().then(
			(response) => { assert.equal(response.statusCode, 200); done()},
			(err) => done(err)
		);
  });

	it('get() should return a rejected promise when hostname could not been resolved', function(done) {
		let client = new HttpOk('http://www.nzz.chsdf');
		client.get().catch(err => {
			assert.equal(err.code, 'ENOTFOUND');
			done();
		});
	});

	it('get() should return a rejected promise containing the response as the error when statusCode is not 200', function(done) {
		let client = new HttpOk('http://www.nzz.ch/erter');
		client.get().catch(err => {
			assert.equal(err.statusCode, 301);
			assert.equal(err.statusMessage, 'Moved Permanently');
			done();
		});
	});

	//after('close mock server', () => httpServer.close());
});
