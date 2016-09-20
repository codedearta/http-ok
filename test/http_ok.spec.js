const assert = require('assert');
const http = require('http');
const HttpOk = require('../src/http_ok.js');

describe('http-ok test suite', function() {
    let client, server, serverPort = 12345, requestOptions, nextResult;

    before('create a test server', () => {
        server = http.createServer((req, res) => {
            res.statusCode = nextResult.statusCode;
            res.end(nextResult.body);
        });
        server.on('clientError', (err, socket) => {
            socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
        });
        server.listen(serverPort);
    });

    beforeEach('given: initialize nextResult and requestOptions', () => {
        nextResult = { body : 'hello', statusCode : 200 };
        requestOptions = { hostname: 'localhost', port: serverPort, path: '' };
        client = new HttpOk();
    });

    beforeEach('given: create a new HttpOk client', () => {
        client = new HttpOk();
    });

    it('get() should return a promise and resolved when statusCode is 200', function() {
      const response = client.get(requestOptions); // when
      return response.then(response => assert.equal(response.statusCode, 200)); // then
    });

    it('get() should return a rejected promise containing the response as the error when statusCode is not 200', function() {
      nextResult.statusCode = 301; // given
      const response = client.get(requestOptions); // when
      return response.catch(err => assert.equal(err.statusCode, 301)); // then
    });

    it('get() should return a resolved promise when statusCode is as expected equals 301', function() {
      // given
      nextResult.body = 'Moved Permanently'
      nextResult.statusCode = 301;

      const response = client.get(requestOptions, 301); // when
      return response.then(response => assert.equal(response.statusCode, 301)); //then
    });

    it('get() should return a rejected promise when statusCode is not as expected equals 301', function() {
      // given
      nextResult.body = 'Moved Permanently'
      nextResult.statusCode = 301;

      const response = client.get(requestOptions, 200); // when
      return response.catch(err => assert.equal(err.statusCode, 301)); // then
    });

    it('get() -> response should have a function text() returning a promise to read the body text', function() {
      const response = client.get(requestOptions, 200); // when
      return response.then(response => response.text().then(te => assert.equal(te, 'hello'))); // then
    });

    it('get() should return a rejected promise when hostname could not been resolved', function() {
      requestOptions.hostname = 'www.blah.chxd' // given
      const response = client.get(requestOptions); // when
      return response.catch(err => assert.equal(err.code, 'ENOTFOUND')); // then
    });

    after('close mock server', () => server.close());
});
