const axios = require("axios");

exports.handler = function (event, condition, callback) {
	const obj = [];
	axios
		.get("https://www2.zoetis.ca/sitemap.xml")
		.then((response) => {
			obj.push(encodeURIComponent(response.data));
			axios
				.get("https://www.zoetis.ca/sitemap.xml")
				.then((res) => {
					obj.push(encodeURIComponent(res.data));
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
