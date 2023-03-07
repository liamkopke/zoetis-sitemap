exports.handler = async (event, condition) => {
    fetch("https://www2.zoetis.ca/sitemap.xml")
    .then((response) => {
        return {
            statusCode: 200,
            body: response.text()
        };
    });    
};