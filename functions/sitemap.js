const axios = require("axios");
const fs = require("fs");

exports.handler = function (event, condition, callback) {
	const { json } = require("./sitemap.json");
	try {
		console.log(JSON.stringify(json));
		callback(null, {
			statusCode: 200,
			body: JSON.stringify(json),
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (err) {
		callback(err);
	}
	// axios
	// 	.get("https://www2.zoetis.ca/sitemap.xml")
	// 	.then((response) => {
	// 		callback(null, {
	// 			statusCode: 200,
	// 			body: response.data,
	// 			headers: {
	// 				"Content-Type": "application/xml",
	// 			},
	// 		});
	// 	})
	// 	.catch((error) => {
	// 		callback(error);
	// 	});
};
