//##################
//This code is for rendering the map and for drawing markers. You do not need to modify it.
//##################
let map;
let currentMapMarker;
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 64.1459303, lng: -21.94293 },
    zoom: 15,
  });
}
function setCenter(targetLat, targetLng, descriptor) {
  map.setCenter({ lat: targetLat, lng: targetLng });
  if (currentMapMarker !== undefined) {
    currentMapMarker.setMap(null);
  }
  currentMapMarker = new google.maps.Marker({
    position: { lat: targetLat, lng: targetLng },
    map: map,
  });
  let infowindow = new google.maps.InfoWindow({ content: descriptor });
  infowindow.open(map, currentMapMarker);
}
//##################
//Map code finished.
//##################

async function getAllEateries() {
  const eateries = await fetchEateries();
  console.log(eateries);
  renderEateries(eateries);
}

async function fetchEateries() {
  try {
    const response = await axios.get("http://localhost:3000/api/v1/eateries");
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

function renderEateries(eateries) {
  let eatList = document.getElementById("eatList");
  eatList.innerHTML = "";

  if (eateries !== null) {
    eateries.forEach((eatery, i) => {
      let eatDiv = document.createElement("div");
      let eatItem = document.createElement("p");
      let eatHeader = document.createElement("h3");
      let eatButton = document.createElement("button");
      eatButton.innerHTML = "Show information";
      eatButton.addEventListener("click", () => displayEateryInfo(eatery));
      eatDiv.classList.add("eatery");
      eatHeader.textContent = `Eatery ${i + 1}`;
      let eatText = document.createTextNode(`Name: ${eatery.name}\n`);
      eatDiv.appendChild(eatHeader);
      eatItem.appendChild(eatText);
      eatDiv.appendChild(eatItem);
      eatDiv.appendChild(eatButton);
      eatList.appendChild(eatDiv);
    });
  }
}

function displayEateryInfo(eatery) {
  let details = document.getElementById("textDescription");
  details.innerHTML = "";
  const name = document.createElement("p");
  name.innerHTML = eatery.name;
  const description = document.createElement("p");
  description.innerHTML = eatery.description;
  const img = document.createElement("img");
  img.src = eatery.logo;
  details.appendChild(name);
  details.appendChild(description);
  details.appendChild(img);
  setCenter(eatery.location.lat, eatery.location.lng, eatery.name);
}

getAllEateries();
