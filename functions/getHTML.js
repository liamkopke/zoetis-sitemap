const axios = require('axios');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

exports.handler = (event, context, callback) => {    
    console.log(event.queryStringParameters.link);
    axios.get("https://www2.zoetis.ca" + event.queryStringParameters.link)
    .then(response => {
        if(response.status === 200){
            const html = (new JSDOM(response.data, { runScripts: "dangerously" })).window.document.links
            var arr = [];
            for(var i=0; i<html.length; i++) {
                if(arr.indexOf(html[i].href) === -1){  
                    arr.push(html[i].href);
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