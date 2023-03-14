const axios = require('axios');
const puppeteer = require('puppeteer');

exports.handler = async (event, context, callback) => { 
    try{
        const url = "https://www2.zoetis.ca" + event.queryStringParameters.link;
        console.log(url);
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url, {
            waitUntil: 'networkidle0'
        });  
        var hrefs = await page.$$eval('a', as => as.map(a => a.href));
        console.log(hrefs)
        await browser.close();
        callback(null, {
            statusCode: 200,
            body: hrefs,
            headers:{
                'Content-Type': 'application/json'
            }
        })
    }
    catch(error){
        callback(null, {
            statusCode: 500,
            body: error
        });
    }    
};