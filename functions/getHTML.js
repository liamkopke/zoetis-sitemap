const puppeteer = require('puppeteer');
const chromium = require('chrome-aws-lambda');

exports.handler = async (event, context, callback) => { 
    try{
        const url = "https://www2.zoetis.ca" + event.queryStringParameters.link;
        console.log(url);
        const browser = await puppeteer.launch({
            args: chromium.args,
            executablePath: await chromium.executablePath,
            headless: true
        });
        const page = await browser.newPage();
        await page.goto(url, {
            waitUntil: 'networkidle0'
        });  
        var hrefs = await page.$$eval('a', as => as.map(a => a.href));
        console.log(hrefs)
        await browser.close();
        return {
            statusCode: 200,
            body: JSON.stringify(hrefs)
        }
    }
    catch(error){
        callback(null, {
            statusCode: 500,
            body: error
        });
    }    
};