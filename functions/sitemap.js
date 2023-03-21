const axios = require("axios");
const fs = require("fs");

exports.handler = function (event, condition, callback) {
	try {
		const data = JSON.parse(fs.readFileSync("src/sitemap.json").toString());
		callback(null, {
			statusCode: 200,
			body: data,
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
