const axios = require('axios');

exports.handler = (event, context, callback) => {    
    console.log(event.queryStringParameters.link);
    axios.get("https://www2.zoetis.ca" + event.queryStringParameters.link)
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
        callback(null, {
            statusCode: 200,
            body: arr,
            headers:{
                'Content-Type': 'application/json'
            }
        })
    })
    .catch(error => {
            callback(error)
        }
    )
};