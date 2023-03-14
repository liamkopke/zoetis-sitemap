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
        console.log("After Browser")
        const page = await browser.newPage();
        console.log("After New Page")
        await page.goto(url, {
            waitUntil: 'networkidle0'
        });  
        console.log("After goto")
        var hrefs = await page.$$eval('a', as => as.map(a => a.href));
        onsole.log("After hrefs")
        console.log(hrefs)
        await browser.close();
        onsole.log("After close")
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