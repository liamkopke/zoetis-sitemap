const axios = require("axios");
const obj = {};

exports.handler = function (event, condition, callback) {
	axios
		.get("https://www2.zoetis.ca/sitemap.xml")
		.then((response) => {
			obj["/www2.zoetis.ca"] = response.data;
			axios
				.get("https://www.zoetis.ca/sitemap.xml")
				.then((res) => {
					obj["/www.zoetis.ca"] = res.data;
					callback(null, {
						statusCode: 200,
						body: JSON.stringify(obj),
						headers: {
							"Content-Type": "application/json",
						},
					});
				})
				.catch((error) => {
					callback(error);
				});
		})
		.catch((error) => {
			callback(error);
		});
};
