const axios = require('axios');
const jsdom = require('jsdom');

exports.handler = (event, context, callback) => {    
    console.log(event.queryStringParameters.link);
    axios.get("https://www2.zoetis.ca" + event.queryStringParameters.link)
    .then(response => {
        if(response.status === 200){
            const dom = new jsdom(response.data);
            var arr = []
            dom.window.document.querySelectorAll('a').forEach(a => {
                if(arr.indexOf(a.textContent) === -1){  
                    arr.push(a.textContent);
                }
            });
            callback(null, {
                statusCode: 200,
                body: arr,
                headers:{
                    'Content-Type': 'application/json'
                }
            })
        }        
    })
    .catch(error => {
            callback(error)
        }
    )
};