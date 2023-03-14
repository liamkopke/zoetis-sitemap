let endpointMasterEn
let endpointMasterFr
const ulIndex = document.querySelector('.secondary ul')

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

async function generateNavigation(endpoints) {
    console.log("In Generate Nav")
    // Split the endpoints into an object
    const endpointObject = splitEndpoints(endpoints);

    async function generateHTML(endpointObject) {
      // Create a new unordered list element
      const ul = document.createElement("ul");
      ul.classList.add()
    
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

        // Add the buttons into the a tag
        if(Object.keys(endpointObject[key]).length >= 1){
          const button = document.createElement("button");
          button.innerText = "-";
          a.appendChild(button);
        }
        a.appendChild(document.createTextNode(key));
        a.setAttribute("target", '_blank');

        li.appendChild(a);

        // For description, add <small> to <a>        
        console.log("Gettings links")
        const small = document.createElement("small");
        let o = await fetch(`/.netlify/functions/getHTML?link=${obj != undefined ? obj.endpoint : key}`)
        small.textContent = o.text();
        a.appendChild(small);
        
        // Check if this is the second level after the root level '/'
        if (key !== '/' && key !== "/fr" && ((endpointMasterEn['/'] == endpointObject) || (endpointMasterFr["/fr"] == endpointObject)) && Object.keys(endpointObject[key]).length === 0) {
          // If there are no child elements, move the list item to a new ul element
          ulIndex.appendChild(li);
        }
        else{
          const nestedHTML = await generateHTML(endpointObject[key]);
          li.appendChild(nestedHTML);           
  
          // Append the list item to the unordered list
          ul.appendChild(li);
        }
      }
    
      // Return the unordered list element
      return ul;
    }

    // Make EN / FR objects   
    endpointMasterFr = {
      "/fr": JSON.parse(JSON.stringify(endpointObject['/']["/fr"]))
    };
    endpointMasterEn = JSON.parse(JSON.stringify(endpointObject));
    delete endpointMasterEn['/']['/fr']
  
    // Generate the HTML for the endpoint object
    const navHTMLEn = await generateHTML(endpointMasterEn);
    const navHTMLFr = await generateHTML(endpointMasterFr);
  
    // Add the nav HTML to the document
    const navEn = document.querySelector(".en");
    const navFr = document.querySelector(".fr");

    // Add the content
    navEn.appendChild(navHTMLEn);
    navFr.appendChild(navHTMLFr);
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

// Server Commands - DO NOT DELETE
fetch("/.netlify/functions/sitemap")
.then(response => response.text())
.then((xmlString) => async () => {
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
  await generateNavigation(json);

  handleChange(document.querySelector("input"))
  handleButtons();
})
.catch((error) => {
  console.error(error);
});


// Lang Switch
function handleChange(checkbox){
  document.querySelectorAll('.en').forEach(x => {
    toggleVisibility(x, !checkbox.checked)
  });
  document.querySelectorAll('.fr').forEach(x => {
    toggleVisibility(x, checkbox.checked)
  })
}

function handleButtons(){
  // Button See More/Less
  document.querySelectorAll("button").forEach(button => {
    button.addEventListener('click', event => {
      event.stopPropagation();
      event.preventDefault();
      // Get ul in same li as button
      const listElement = button.parentNode.parentNode.querySelector('ul');

      // Toggle vis for ul
      toggleVisibility(listElement, button.innerText == "+")
      button.innerText = button.innerText == "-" ? "+" : "-";        
    })
  })
}

function toggleVisibility(element, isVisible){
  if(isVisible){
    element.style.display = "inline-block";
  }
  else{
    element.style.display = "none";
  }
}