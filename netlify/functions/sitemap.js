exports.handler = async (event, condition) => {
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