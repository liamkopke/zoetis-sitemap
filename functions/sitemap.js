exports.handler = async (event, condition) => {
    let response
    try{
        await fetch("https://www2.zoetis.ca/sitemap.xml")
        .then((res) => response = res.text())
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