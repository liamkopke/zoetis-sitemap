const axios = require('axios');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

exports.handler = (event, context, callback) => {    
    console.log(event.queryStringParameters.link);
    axios.get("https://www2.zoetis.ca" + event.queryStringParameters.link)
    .then(response => {
        if(response.status === 200){
            const { document } = (new JSDOM(response.data, { runScripts: "dangerously" })).window
            console.log(document.querySelectorAll('a'))
            console.log(reponse.data.querySelectorAll('a'))
            var arr = [], l = document.links;
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
        }        
    })
    .catch(error => {
            callback(error)
        }
    )
};