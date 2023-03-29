const axios = require("axios");

exports.handler = async function (event, condition, callback) {
	const obj = {};
	axios
		.get("https://www2.zoetis.ca/sitemap.xml")
		.then((response) => {
			console.log(response.data);
			obj["/www2.zoetis.ca"] = response.data;
			console.log(obj);
			axios
				.get("https://www.zoetis.ca/sitemap.xml")
				.then((res) => {
					obj["/www.zoetis.ca"] = res.data;
					console.log(obj);
					callback(null, {
						statusCode: 200,
						body: obj,
						headers: {
							"Content-Type": "application/json",
						},
					});
				})
				.catch((error) => {
					callback("www");
				});
		})
		.catch((error) => {
			callback("www2");
		});
};
