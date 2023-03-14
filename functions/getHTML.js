const axios = require('axios');

exports.handler = async ({ queryStringParameters }) => {
    const { link } = queryStringParameters;
    console.log(link);
    axios.get("https://www2.zoetis.ca" + link)
    .then(response => response.text())
    .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        var arr = [], l = doc.links;
        for(var i=0; i<l.length; i++) {
            if(arr.indexOf(l[i].href) === -1){  
                arr.push(l[i].href);
            }
        }
        return {
            statusCode: 200,
            body: arr,
            headers:{
                'Content-Type': 'application/json'
            }
        };
    })
    .catch(error => 
        {
            return {
                statusCode: 500,
                body: "There was an error fetching",
                headers:{
                    'Content-Type': 'application/text'
                }
            }
        }
    )
};