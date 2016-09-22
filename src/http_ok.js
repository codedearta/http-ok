// @flow

const http = require('http');
const url = require('url');

class HttpOk {
  agent: boolean;

	constructor(agent:boolean = false) {
    this.agent = agent;
  }

  get(requestOptions: Object, expectedStatusCode: number = 200) {
		const requestOptionsObject = this.parseRequestOptions(requestOptions);
		return this.request(requestOptionsObject, undefined, expectedStatusCode);
	}

	post(requestOptions: Object, postData: string, expectedStatusCode:number = 200) {
		const requestOptionsObject = this.parseRequestOptions(requestOptions);
		requestOptionsObject.method = 'POST';
		return this.request(requestOptionsObject, postData, expectedStatusCode);
	}

	parseRequestOptions(requestOptions: Object) {
		if(typeof requestOptions !== 'string') {
			return requestOptions;
		}

		const urlObj = url.parse(requestOptions);
		return {
			hostname: urlObj.hostname,
			port: urlObj.port ? urlObj.port : 80,
			path: urlObj.pathname,
			method: 'GET'
		};
	}

	request(requestOptions:Object, postData:string = '', expectedStatusCode:number = 200) {
		const requestOptionsObject = this.parseRequestOptions(requestOptions);

		return new Promise((resolve, reject) => {
			const request = http.request(requestOptionsObject, (response) => {
					if(response.statusCode === expectedStatusCode) {
						const okResponse = Object.assign({ text:undefined }, response);
						okResponse.text = () => this.bodyText(response);
						resolve(okResponse);
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

	bodyText(response:Object) {
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
