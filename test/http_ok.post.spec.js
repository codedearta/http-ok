const assert = require('assert');
const http = require('http');
const querystring = require('querystring');
const HttpOk = require('../src/http_ok.js');



describe('http-ok.post()', () => {
    let client, server, serverPort = 12345, requestOptions = {}, nextResult = {}, postData;

    before('create a test server', () => {
        server = http.createServer((req, res) => {
            res.statusCode = nextResult.statusCode;

            if (req.method == 'POST') {
                req.on('data', function(chunk) {
                  //console.log("Received body data:", chunk.toString());
                });

                req.on('end', function() {
                  res.writeHead(nextResult.statusCode, "OK", {'Content-Type': 'text/html'});
                  res.end(nextResult.body);
                });

              } else {
                res.end(nextResult.body);
              }
        });
        server.on('clientError', (err, socket) => {
            socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
        });
        server.listen(serverPort);

    });

    beforeEach('given: initialize nextResult and requestOptions', () => {
        nextResult.body = '<html><body>hello</body></html>'
        nextResult.statusCode = 200;

        const formData = {};
        formData.name = 'Bob Mc Bobson';
        formData.street = 'jack street';
        formData.place = 'Cheddar';
        postData = querystring.stringify(formData);

        requestOptions.hostname = 'localhost';
        requestOptions.port = serverPort;
        requestOptions.headers = {}
        requestOptions.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        requestOptions.headers['Content-Length'] = Buffer.byteLength(postData);
    });

    beforeEach('given: create a new HttpOk client', () => {
        client = new HttpOk();
    });

    it('should return a RESOLVED promise when statusCode is 200', () => {
      const response = client.post(requestOptions, postData); // when
      return response.then(response => assert.equal(response.statusCode, 200)); // then
    });

    it('should return a RESOLVED promise when statusCode is as expected 301', () => {
      // given
      nextResult.body = 'Moved Permanently'
      nextResult.statusCode = 301;

      const response = client.post(requestOptions, postData, 301); // when
      return response.then(response => assert.equal(response.statusCode, 301)); //then
    });

    it('should return a REJECTED promise when statusCode is not 200', () => {
      nextResult.statusCode = 301; // given
      const response = client.post(requestOptions, postData, 200); // when
      return response.catch(err => assert.equal(err.statusCode, 301)); // then
    });

    it('should return a REJECTED promise when statusCode is not as expected 301', () => {
      // given
      nextResult.body = 'Moved Permanently'
      nextResult.statusCode = 301;

      const response = client.post(requestOptions, postData, 200); // when
      return response.catch(err => assert.equal(err.statusCode, 301)); // then
    });

    it('should return a REJECTED promise when hostname could not been resolved', () => {
      requestOptions.hostname = 'www.blah.chxd' // given
      const response = client.post(requestOptions, postData); // when
      return response.catch(err => assert.equal(err.code, 'ENOTFOUND')); // then
    });

    after('close mock server', () => server.close());
});
