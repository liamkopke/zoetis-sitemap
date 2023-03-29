const axios = require("axios");
const obj = {};

exports.handler = function (event, condition, callback) {
	axios
		.get("https://www2.zoetis.ca/sitemap.xml")
		.then((response) => {
			callback(null, {
				statusCode: 200,
				body: response.data,
				headers: {
					"Content-Type": "application/xml",
				},
			});
		})
		.catch((error) => {
			callback(error);
		});
};
