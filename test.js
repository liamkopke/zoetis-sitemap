function splitEndpoints(endpoints) {
    // Create an object to hold the result, with the root level "/"
    const result = { "/": {} };
    
    // Loop through each endpoint in the array
    for (let i = 0; i < endpoints.length; i++) {
        // Split the endpoint into blocks
        const blocks = endpoints[i].endpoint.split("/");
    
        // Start at the root level
        let currentBlock = result["/"];
    
        // Loop through each block (skipping the first empty one)
        for (let j = 1; j < blocks.length; j++) {
        const block = blocks[j];
    
        // Ignore empty blocks (e.g. if the endpoint starts with "/")
        if (block !== "") {
            // If the block doesn't exist yet, create it
            if (!currentBlock["/" + block]) {
            currentBlock["/" + block] = {};
            }
    
            // Move down one level
            currentBlock = currentBlock["/" + block];
        }
        }
    
        // Store the endpoint at the current block
        currentBlock = endpoints[i].endpoint;
    }
    
    // Return the result object
    return result;
}

function generateNavigation(endpoints) {
    // Split the endpoints into an object
    const endpointObject = splitEndpoints(endpoints);
    console.log(endpointObject);
  
    /*
    // Create a helper function to recursively generate the HTML
    function generateHTML(endpointObject) {
      // Create a new unordered list element
      const ul = document.createElement("ul");
  
      // Loop through each key in the endpoint object
      for (const key in endpointObject) {
        // Create a new list item element with the key as the ID
        const li = document.createElement("li");
        li.id = key;
  
        // Get object for that key
        const obj = getHref(key, endpoints);

        // Create an anchor tag element with the ID as the href attribute
        const a = document.createElement("a");
        a.href = `https://www2.zoetis.ca${obj != undefined ? obj.endpoint : key}`;
        a.textContent = key;
        li.appendChild(a);
  
        // If the current value is a string (i.e. an endpoint), add it as an anchor tag
        if (typeof endpointObject[key] === "string") {
          const small = document.createElement("small");
          small.textContent = "Some kind of description";
          a.appendChild(small);
        }
        // Otherwise, generate the HTML for the nested object and append it to the list item
        else {
          const nestedHTML = generateHTML(endpointObject[key]);
          li.appendChild(nestedHTML);
        }
  
        // Append the list item to the unordered list
        ul.appendChild(li);
      }
  
      // Return the unordered list element
      return ul;
    }
    */

    function generateHTML(endpointObject) {
      // Create a new unordered list element
      const ul = document.createElement("ul");
    
      // Loop through each key in the endpoint object
      for (const key in endpointObject) {
        // Create a new list item element with the key as the ID
        const li = document.createElement("li");
        li.id = key;
    
        // Get object for that key
        const obj = getHref(key, endpoints);
    
        // Create an anchor tag element with the ID as the href attribute
        const a = document.createElement("a");
        a.href = `https://www2.zoetis.ca${obj != undefined ? obj.endpoint : key}`;
        a.textContent = key;
        li.appendChild(a);
    
        // If the current value is a string (i.e. an endpoint), add it as an anchor tag
        if (typeof endpointObject[key] === "string") {
          const small = document.createElement("small");
          small.textContent = "Some kind of description";
          a.appendChild(small);
        }
        // Otherwise, generate the HTML for the nested object and append it to the list item
        else {
          const nestedHTML = generateHTML(endpointObject[key]);
          li.appendChild(nestedHTML);
    
          // Check if this is the second level after the root level '/'
          console.log("Key: " + key + " - Endp Obj: " + endpointObject)
          if (key !== '/' && Object.keys(endpointObject[key]).length === 0) {
            // If there are no child elements, move the list item to a new ul element
            const newUL = document.createElement('ul');
            newUL.appendChild(li);
            
            // Create a new nav element with class 'secondary' and append the new ul element
            const newNav = document.createElement('nav');
            newNav.classList.add('secondary');
            newNav.appendChild(newUL);
    
            // Replace the existing li element with the new nav element
            document.body.appendChild(newNav);
          }
        }
    
        // Append the list item to the unordered list
        ul.appendChild(li);
      }
    
      // Return the unordered list element
      return ul;
    }
  
    // Generate the HTML for the endpoint object
    const navHTML = generateHTML(endpointObject);
  
    // Add the nav HTML to the document
    const nav = document.createElement("nav");
    nav.classList.add("primary");
    nav.appendChild(navHTML);
    document.body.appendChild(nav);
  }

function getHref(key, endpoints){
  const x = endpoints.filter(
    (data) => {
      return data.endpoint.endsWith(key);
    }
  )  

  if (x === []){
    x = endpoints.filter(
      (data) => {
        return data.endpoint.endsWith(key + "/");
      }
    )
  }
  
  return x[0];
}


const parser = new DOMParser();

fetch("/.netlify/functions/sitemap")
.then(response => response.text())
.then((xmlString) => {
  const xml = parser.parseFromString(xmlString, "application/xml");

  const urls = xml.getElementsByTagName("url");
  const json = [];

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const loc = url.getElementsByTagName("loc")[0].textContent;
    const endpoint = loc.replace("https://www2.zoetis.ca", "");
    const lastmod = url.getElementsByTagName("lastmod")[0].textContent;

    json.push({ endpoint, lastmod });
  }

  console.log(json);
  generateNavigation(json);
})
.catch((error) => {
  console.error(error);
});