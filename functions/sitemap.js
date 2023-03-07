const axios = require('axios');

exports.handler = async (event, condition) => {
    const url = "https://www2.zoetis.ca/sitemap.xml";
    fetch(url)
        .then((response) => {
            console.log(response.json());
            console.log(response);
            return {
                statusCode: 200,
                body: response.json()
            }
        })
        .catch((err) => {
            console.log(err);
            return{
                statusCode: err.statusCode || 500,
                body: JSON.stringify({error: err.message})
            }
        })
};