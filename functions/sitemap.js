const axios = require('axios');

exports.handler = async (event, condition) => {
    const url = "https://www2.zoetis.ca/sitemap.xml";
    axios.get(url)
        .then((response) => {
            console.log(response.json());
            console.log(response.data);
            console.log(response);
            return {
                statusCode: 200,
                body: response
            }
        })        
};