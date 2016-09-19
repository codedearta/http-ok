const http = require('http');

function HttpOk(host, port = 80, agent = false) {
	this.host = host;
	this.port = port;
	this.agent = agent;
}

HttpOk.prototype.get = function() {
	return new Promise((resolve, reject) => {
		const get = http.get(this.host, response => {
				if(response.statusCode === 200) {
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
