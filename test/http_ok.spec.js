const assert = require('assert');
const http = require('http');
const HttpOk = require('../src/http_ok.js');

describe('http-ok.', function() {
  let client;

  beforeEach(() => {
    client = new HttpOk();
  });

  it('get() should return a promise and resolved when statusCode is 200', function(done) {
		client.get('http://www.nzz.ch').then(
			(response) => { assert.equal(response.statusCode, 200); done()},
			(err) => done(err)
		);
  });

	it('get() should return a rejected promise when hostname could not been resolved', function(done) {
		client.get('http://www.nzz.chsdf').catch(err => {
			assert.equal(err.code, 'ENOTFOUND');
			done();
		});
	});

	it('get() should return a rejected promise containing the response as the error when statusCode is not 200', function(done) {
		client.get('http://www.nzz.ch/erter').catch(err => {
			assert.equal(err.statusCode, 301);
			assert.equal(err.statusMessage, 'Moved Permanently');
			done();
		});
	});


  it('get() should return a promise and resolved when statusCode is as expected equals 301', function(done) {
    client.get('http://www.nzz.ch/erter', 301).then(
      (response) => { assert.equal(response.statusCode, 301); done()},
      (err) => done(err)
    );
  });

  after(() => {

  })

	//after('close mock server', () => httpServer.close());
});
