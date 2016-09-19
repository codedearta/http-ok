const http = require('http');

function HttpOk(agent = false) {
	this.agent = agent;
}

HttpOk.prototype.get = function(host, expectedStatusCode = 200) {
	return new Promise((resolve, reject) => {
		const get = http.get(host, response => {
				if(response.statusCode === expectedStatusCode) {
					resolve(response);
				} else {
					reject(response);
				}
			});
			get.on('error', error => {
				reject(error);
			});
	});
}

module.exports = HttpOk;
