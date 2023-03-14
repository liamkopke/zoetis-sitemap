const axios = require('axios');
const jsdom = require('jsdom');

exports.handler = (event, context, callback) => {    
    console.log(event.queryStringParameters.link);
    axios.get("https://www2.zoetis.ca" + event.queryStringParameters.link)
    .then(response => {
        if(response.status === 200){
            console.log(response.data)
            const dom = new jsdom.JSDOM(response.data);
            var arr = []
            console.log(dom.window.document.querySelectorAll('a'));
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