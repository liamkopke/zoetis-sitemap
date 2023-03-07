const fetch = require('node-fetch')

exports.handler = async (event, condition) => {
    let response
    try{
        reponse = await fetch("https://www2.zoetis.ca/sitemap.xml")   
    }
    catch (err){
        return{
            statusCode: err.statusCode || 500,
            body: JSON.stringify({error: err.message})
        }
    }

    return {
        statusCode: 200,
        body: JSON.stringify({
            data: response
        })
    }
};