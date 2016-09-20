const http = require('http');
const url = require('url');

class HttpOk {
	constructor(agent = false) {
    this.agent = agent;
  }

  get(requestOptions, expectedStatusCode = 200) {
		const ro = this.parseRequestOptions(requestOptions);
		ro.method = 'GET';
		return this.request(ro, undefined, expectedStatusCode);
	}

	post(requestOptions, postData, expectedStatusCode = 200) {
		const ro = this.parseRequestOptions(requestOptions);
		ro.method = 'POST';
		return this.request(ro, postData, expectedStatusCode);
	}

	parseRequestOptions(requestOptions) {
		if(typeof requestOptions !== 'string') {
			return requestOptions;
		}

		const urlObj = url.parse(requestOptions);
		return {
			hostname: urlObj.hostname,
			port: urlObj.port ? urlObj.port : 80,
			path: urlObj.pathname,
		};
	}

	request(requestOptions, postData, expectedStatusCode = 200) {
		return new Promise((resolve, reject) => {
			const request = http.request(requestOptions, (response) => {
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
				if(postData) {
					request.write(postData);
				}
				request.end();
		});
	}

	bodyText(response) {
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
}

module.exports = HttpOk;
