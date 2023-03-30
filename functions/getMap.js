exports.handler = function (event, condition, callback) {
	const json = require("./map.json");
	callback(null, {
		statusCode: 200,
		body: JSON.stringify(json),
		headers: {
			"Content-Type": "application/json",
		},
	});
};
