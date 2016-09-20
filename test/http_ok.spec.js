const assert = require('assert');
const http = require('http');
const HttpOk = require('../src/http_ok.js');

describe('http-ok test suite', function() {
  let client, server, serverPort = 12345;

  before('create a test server', () => {
    server = http.createServer((req, res) => {
      this.nextResult = 'hello';
      //res.statusCode = 500;
      res.end(this.nextResult);
    });
    server.on('clientError', (err, socket) => {
      socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
    });
    server.listen(serverPort);
  });

  before('create a new HttpOk client',() => { client = new HttpOk(); });

  it('get() should return a promise and resolved when statusCode is 200', function(done) {
		client.get('http://www.nzz.ch')
    .then(response => assert.equal(response.statusCode, 200))
    .then(error => done(error));
  });

	it('get() should return a rejected promise when hostname could not been resolved', function(done) {
		client.get('http://www.nzz.chsdf')
    .catch(err => assert.equal(err.code, 'ENOTFOUND'))
    .then(error => done(error));
	});

	it('get() should return a rejected promise containing the response as the error when statusCode is not 200', function(done) {
		client.get('http://www.nzz.ch/erter').catch(err => {
  			assert.equal(err.statusCode, 301);
  			assert.equal(err.statusMessage, 'Moved Permanently');
		}).then(error => done(error));
	});


  it('get() should return a resolved promise when statusCode is as expected equals 301', function(done) {
    client.get('http://www.nzz.ch/erter', 301)
    .then(response => assert.equal(response.statusCode, 301))
    .then(error => done(error));
  });

  it('get() should return a resolved promise containing an async function to read the body text', function(done) {
    client.get({ hostname: 'localhost', port: serverPort }, 200)
    .then(response => response.text().then(te => assert.equal(te, 'hello'))
    .then(error => done(error)));
  });

	after('close mock server', () => server.close());
});
