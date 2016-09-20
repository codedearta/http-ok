http-ok
==========

[![npm version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![coverage status][coveralls-image]][coveralls-url]

A simple promise based http client which rejects the promise when the status is not 200 - OK


# Motivation

Instead of having if-statements to check the http status code when a request returns, http-ok rejects the promise when the status code is not as expected (by default 200).

example code when using a http-client like node fetch:
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

example code when using http-ok:
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
