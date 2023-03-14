const axios = require('axios');

exports.handler = (event, context, callback) => {    
    console.log(event.queryStringParameters.link);
    axios.get("https://www2.zoetis.ca" + event.queryStringParameters.link, {responseType: 'document'})
    .then(html => {
        console.log(html);
        console.log(html.links);
        var arr = [], l = html.links;
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