exports.handler = async (event, condition) => {
    fetch("https://www2.zoetis.ca/sitemap.xml")
        .then((response) => response.text())
        .then((xmlString) => {
            console.log(xmlString);
            return {
                statusCode: 200,
                body: JSON.stringify({
                    data: xmlString
                })
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