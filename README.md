http-ok
==========

[![npm version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![coverage status]][coveralls-url]

A simple promise based http client which rejects the promise when the status is not 200 - OK

## Motivation

Instead of having if-statements to check the http status code when a request returns, http-ok rejects the promise when the status code is not as expected (by default 200). This should make the promise chain look much simpler and more focused on the succes flow.

Example code using 'http-ok':
```javascript
const HttpOk = require("http-ok")
const client = new HttpOk(); 

client.get('www.google.com')
  .then(response => {
    /// process here the response
  })
  .catch(error => {
    /// error handling here
  }
});
```

Example code using a http-client like 'node-fetch':
```javascript
const fetch = require("node-fetch");

fetch('www.google.com')
  .then(response => {
      if(response.statusCode === 200) {
        /// process here the response
      } else {
        // error handling here
      }
    }
  );

```

# Features

- More natural promise chain by rejecting the promis when response code is not OK
- Stay consistent with `node http` API. Uses the same request options object.
- Use native promise.


# Difference from node-fetch

- See [Link to Header](#motivation) for details.

# Install

`npm install http-ok --save`


# Usage

```javascript
const HttpOk = require('http-ok');
const client = new HttpOk();

// plain text or html

client.get('https://github.com/')
	.then(res => res.text())
	.then(text => console.log(body);
	});

// json

client.get('https://api.github.com/users/github')
	.then(function(res) {
		return res.json();
	}).then(function(json) {
		console.log(json);
	});

// post with form data and custom headers
const formData = {};
formData.name = 'Bob Mc Bobson';
formData.place = 'Cheddar';
const postData = querystring.stringify(formData);

const requestOptions = {};
requestOptions.hostname = 'http://httpbin.org';
requestOptions.headers = {}
requestOptions.headers['Content-Type'] = 'application/x-www-form-urlencoded';
requestOptions.headers['Content-Length'] = Buffer.byteLength(postData);
        
client.post(requestOptions, postData, 200)
	.then(function(res) {
		// process here the response
	}).catch(json => {
		// error handling here
	});

```

See [test cases](https://github.com/codedearta/http-ok/tree/master/test) for more examples.

# API

- get(url) // default 200
- get(url, expectedStatusCode)
- get(options, expectedStatusCode)

- post(url, postData) // default 200
- post(url, postData, expectedStatusCode)
- post(options, postData, expectedStatusCode)

Returns a `Promise`

### url

Should be an absolute url, eg `http://example.com`

### options

same as node.js http.request options.

### expectedStatusCode

and integer eg `200` or `301`

### postData

url encoded string

# License

MIT

[npm-image]: https://badge.fury.io/js/http-ok.svg
[npm-url]: https://www.npmjs.com/package/http-ok
[travis-image]: https://travis-ci.org/codedearta/http-ok.svg?branch=master
[travis-url]: https://travis-ci.org/codedearta/http-ok
[coveralls-image]: https://coveralls.io/repos/github/codedearta/http-ok/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/codedearta/http-ok
