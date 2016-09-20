const http = require('http');
const url = require('url');

function HttpOk(agent = false) {
	this.agent = agent;
}

HttpOk.prototype.get = function(requestOptions, expectedStatusCode = 200) {
	let innerRequestOptions;

	if(typeof requestOptions === 'string') {
		const urlObj = url.parse(requestOptions);
		innerRequestOptions = {
		  hostname: urlObj.hostname,
		  port: urlObj.port ? urlObj.port : 80,
		  path: urlObj.pathname,
		  method: 'GET'
		};
	} else {
		innerRequestOptions = requestOptions
	}

	return new Promise((resolve, reject) => {
		const request = http.request(innerRequestOptions, (response) => {
				if(response.statusCode === expectedStatusCode) {
					response.text = () => this.bodyText(response);
					resolve(response);
				} else {
					reject(response);
				}
			});
			request.on('error', error => {
				reject(error);
			});
			request.end();
	});
}

HttpOk.prototype.bodyText = function(response) {
	return new Promise((resolve, reject) => {
		 response.setEncoding('utf8');
		 let body = '';
		 response.on('data', (chunk) => {
			 body += chunk;
		 });
		 response.on('end', () => {
			 resolve(body);
		 });
		 response.on('error', err => reject(err));
 });
}

module.exports = HttpOk;
