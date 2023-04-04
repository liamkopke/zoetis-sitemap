console.log(
	"%cCustom JS: Liam Kopke%c - https://liamkopke.com\n%cDate: 30/03/2023\n%cCSS and HTML Template:%c https://github.com/mattbrailsford/css-sitemap",
	"color: black; background: yellow; font-size: 30px",
	"color: white; font-size: 30px",
	"color: black; background: cornflowerblue; font-size: 30px",
	"color: black; background: greenyellow; font-size: 30px",
	"color: white; font-size: 30px"
);

let endpointMasterEn;
let endpointMasterFr;
const ulIndex = document.querySelector(".secondary ul");

function splitEndpoints(endpoints) {
	// Create an object to hold the result, with the root level "/"
	const result = {};

	for (let lang in endpoints) {
		result[lang] = {};
		// Loop through each endpoint in the array
		for (let endpoint in endpoints[lang]) {
			// Split the endpoint into blocks
			const blocks = endpoint.split("/");

			// Start at the root level
			let currentBlock = result[lang];

			// Loop through each block (skipping the first empty one)
			for (let j = 1; j < blocks.length; j++) {
				const block = blocks[j];

				// If the block doesn't exist yet, create it
				if (!currentBlock["/" + block]) {
					currentBlock["/" + block] = {};
				}

				// Move down one level
				currentBlock = currentBlock["/" + block];
			}

			// Store the endpoint at the current block
			currentBlock = endpoints[lang][endpoint];
		}
	}

	// Return the result object
	return result;
}

async function generateNavigation(endpoints, type) {
	// Split the endpoints into an object
	async function generateHTML(endpoints) {
		// Create a new unordered list element
		const ul = document.createElement("ul");
		ul.classList.add();

		// Loop through each key in the endpoint object
		for (const key in endpoints) {
			if (key == "/" || key == "urls") continue;
			// Create a new list item element with the key as the ID
			const li = document.createElement("li");
			li.id = key;

			// Get object for that key
			const obj = endpoints[key];

			// Create an anchor tag element with the ID as the href attribute
			const a = document.createElement("a");
			a.href = `https:/${key}`;

			// Add the buttons into the a tag
			if (Object.keys(endpoints[key]).length > 1) {
				const button = document.createElement("button");
				button.innerText = "-";
				a.appendChild(button);
			}
			a.appendChild(document.createTextNode(key));
			a.setAttribute("target", "_blank");

			li.appendChild(a);

			// Add URLs
			const ol = document.createElement("ol");
			const urls = obj.urls ?? (obj["/"] ?? { urls: [""] }).urls;
			for (let url in urls) {
				const newa = document.createElement("a");
				newa.innerText = urls[url];
				newa.href = urls[url];
				newa.setAttribute("target", "_blank");
				newa.style.display = "none";
				ol.appendChild(newa);
			}

			if (type !== Types.XML) {
				const button2 = document.createElement("button");
				button2.innerText = "Show URLs";
				ol.appendChild(button2);
			}

			a.appendChild(ol);

			// Add button to minimize urls

			if (endpoints[Object.keys(endpoints)[1]] != undefined) {
				const nestedHTML = await generateHTML(endpoints[key]);
				li.appendChild(nestedHTML);

				// Append the list item to the unordered list
				ul.appendChild(li);
			}
		}

		// Return the unordered list element
		return ul;
	}

	// Make EN / FR objects
	if (type === Types.ACTUAL) {
		endpointMasterFr = {
			"/www2.zoetis.ca": JSON.parse(
				JSON.stringify(endpoints["/www2.zoetis.ca"]["/fr"])
			),
			"/www.zoetis.ca": JSON.parse(
				JSON.stringify(endpoints["/www.zoetis.ca"]["/fr"])
			),
		};
		endpointMasterEn = JSON.parse(JSON.stringify(endpoints));
		delete endpointMasterEn["/www2.zoetis.ca"]["/fr"];
		delete endpointMasterEn["/www.zoetis.ca"]["/fr"];
	} else {
		splitEndpoint = splitEndpoints(endpoints);
		endpointMasterFr = {
			"/www2.zoetis.ca": JSON.parse(
				JSON.stringify(splitEndpoint["/www2.zoetis.ca"]["/fr"])
			),
			"/www.zoetis.ca": {},
		};
		endpointMasterEn = JSON.parse(JSON.stringify(splitEndpoint));
		delete endpointMasterEn["/www2.zoetis.ca"]["/fr"];
		delete endpointMasterEn["/www.zoetis.ca"]["/fr"];
	}

	// Generate the HTML for the endpoint object
	const navHTMLEn = await generateHTML(endpointMasterEn);
	const navHTMLFr = await generateHTML(endpointMasterFr);

	// Add the correct class for the type
	navHTMLEn.classList.add(type);
	navHTMLFr.classList.add(type);

	// Add the nav HTML to the document
	const navEn = document.querySelector(".en");
	const navFr = document.querySelector(".fr");

	// Add the content
	navEn.appendChild(navHTMLEn);
	navFr.appendChild(navHTMLFr);
}

const parser = new DOMParser();

// Server Commands - DO NOT DELETE
fetch("/.netlify/functions/sitemap")
	.then((response) => response.text())
	.then(async (passedJson) => {
		passedJson = JSON.parse(passedJson);
		const netlifyJSON = { "/www2.zoetis.ca": {}, "/www.zoetis.ca": {} };
		for (let site = 0; site < passedJson.length; site++) {
			const xml = parser.parseFromString(
				decodeURIComponent(passedJson[site]),
				"application/xml"
			);
			const urls = xml.getElementsByTagName("url");
			const smallJSON =
				netlifyJSON[site == 0 ? "/www2.zoetis.ca" : "/www.zoetis.ca"];

			for (let i = 0; i < urls.length; i++) {
				const url = urls[i];
				const loc = url.getElementsByTagName("loc")[0].textContent;
				const endpoint = loc.replace(
					`https://${site == 0 ? "www2" : "www"}.zoetis.ca`,
					""
				);
				const lastmod = url.getElementsByTagName("lastmod")[0].textContent;

				smallJSON[endpoint] = { loc, lastmod };
			}
		}
		await generateNavigation(netlifyJSON, Types.XML);
		fetch("/.netlify/functions/getMap")
			.then((response) => response.text())
			.then(async (json) => {
				await generateNavigation(JSON.parse(json), Types.ACTUAL);
			});

		handleLangChange(document.querySelector(".langSwitch"));
		handleTypeChange(document.querySelector(".typeSwitch"));
		handleButtons();
	})
	.catch((error) => {
		console.error(error);
	});

// Lang Switch
function handleLangChange(checkbox) {
	document.querySelectorAll(".en").forEach((x) => {
		toggleVisibility(x, !checkbox.checked);
	});
	document.querySelectorAll(".fr").forEach((x) => {
		toggleVisibility(x, checkbox.checked);
	});
}

function handleTypeChange(checkbox) {
	document.querySelectorAll(".actual").forEach((x) => {
		toggleVisibility(x, checkbox.checked);
	});
	document.querySelectorAll(".xml").forEach((x) => {
		toggleVisibility(x, !checkbox.checked);
	});
}

function handleButtons() {
	// Button See More/Less
	document.querySelectorAll("button").forEach((button) => {
		button.addEventListener("click", (event) => {
			event.stopPropagation();
			event.preventDefault();

			console.log("button clicked");
			// If URL btn
			if (button.innerText.includes("URL")) {
				console.log("url button");
				const urlList = button.parentNode.querySelectorAll("a");
				toggleUrlVisibility(urlList);
				button.innerText =
					button.innerText == "Hide URLs" ? "Show URLs" : "Hide URLs";
			} else {
				console.log("minimize button");
				// Get ul in same li as button
				const listElement = button.parentNode.parentNode.querySelector("ul");

				// Toggle vis for ul
				toggleVisibility(listElement, button.innerText == "+");
				button.innerText = button.innerText == "-" ? "+" : "-";
			}
		});
	});
}

function toggleVisibility(element, isVisible) {
	if (isVisible) {
		element.style.display = "inline-block";
	} else {
		element.style.display = "none";
	}
}

function toggleUrlVisibility(elements) {
	elements.forEach((ol) => {
		if (ol.style.display == "none") {
			ol.style.display = "list-item";
		} else {
			ol.style.display = "none";
		}
	});
}

const Types = Object.freeze({
	ACTUAL: "actual",
	XML: "xml",
});
