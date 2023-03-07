const axios = require('axios');

exports.handler = async (event, condition) => {
    const url = "https://www2.zoetis.ca/sitemap.xml";
    axios.get(url)
        .then((response) => {
            console.log(response);
            console.log(response.data);
            return {
                statusCode: 200,
                body: response.data
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