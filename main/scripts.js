let mapCenter = [27.0778, 30.10516];
let defaultZm = 6;
let minZm = 0;
let maxZm = 19;
let zoomDelt = 0.5;
let zoomSnp = 0;
let myCRS = L.CRS.EPSG3857;

let map = L.map("map", {
  crs: myCRS,
  center: mapCenter,
  zoom: defaultZm,
  minZoom: minZm,
  maxZoom: maxZm,
  zoomDelta: zoomDelt,
  zoomSnap: zoomSnp,
  scrollWheelZoom: true,
  preferCanvas: true,
});

// --> Basemap gallery
let osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}", {
  foo: "bar",
  zoom: defaultZm,
  minZoom: minZm,
  maxZoom: maxZm,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
});

let osmHOT = L.tileLayer(
  "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
  {
    zoom: defaultZm,
    minZoom: minZm,
    maxZoom: maxZm,
    attribution: "© OpenStreetMap contributors",
  },
);

let nasaLayerTerra = L.tileLayer.wms(
  "https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi",
  {
    layers: "MODIS_Terra_CorrectedReflectance_TrueColor",
    default: "EPSG:3857",
    format: "image/png",
    transparent: true,
    noWrap: true,
    continuousWorld: true,
    bounds: [
      [-85.0511287776, -179.999999975],
      [85.0511287776, 179.999999975],
    ],
    attribution: "NASA GIBS",
    time: "2023-01-01",
  },
);

let nasaLayerAqua = L.tileLayer.wms(
  "https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi",
  {
    layers: "MODIS_Aqua_CorrectedReflectance_TrueColor",
    default: "EPSG:3857",
    format: "image/png",
    transparent: true,
    noWrap: true,
    continuousWorld: true,
    bounds: [
      [-85.0511287776, -179.999999975],
      [85.0511287776, 179.999999975],
    ],
    attribution: "NASA GIBS",
    time: "2023-01-01",
  },
);

let Google_Maps = L.tileLayer(
  "https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}",
  {
    zoom: defaultZm,
    minZoom: minZm,
    maxZoom: maxZm,
    attribution:
      '&copy; <a href="http://www.google.com">Google</a> contributors',
  },
);

let esriImg = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    zoom: defaultZm,
    minZoom: minZm,
    maxZoom: maxZm,
    attribution:
      '&copy; <a href="http://www.arcgis.com/home/item.html?id=10df2279f9664e839f6fec3cb4adeba4">ArcGIS</a> contributors',
  },
);

let CartoDB_Dark = L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  {
    zoom: defaultZm,
    minZoom: minZm,
    maxZoom: maxZm,
    attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
);

osm.addTo(map);

let myBasemap = {
  OpenStreetMap: osm,
  "OpenStreetMap HOT": osmHOT,
  "NASA GIBS Terra": nasaLayerTerra,
  "NASA GIBS Aqua": nasaLayerAqua,
  "Google Maps": Google_Maps,
  "ESRI Imagery": esriImg,
  "CartoDB Dark": CartoDB_Dark,
};

let myLayerGroup = L.control.layers(myBasemap).addTo(map);
////////////////////////////////////////////////////////////////////////
let style = {
  color: "#c7820add",
  opacity: 1,
  fillColor: "#c7820add",
  fillOpacity: 0.4,
  weight: 1,
};

//Cluster point style
const markers = L.markerClusterGroup({
  iconCreateFunction: function (cluster) {
    const count = cluster.getChildCount();

    // Determine size class (same logic as default)
    let sizeClass = "small";
    if (count >= 100) {
      sizeClass = "large";
    } else if (count >= 10) {
      sizeClass = "medium";
    }

    // Scale radius based on count
    const radius = Math.min(30 + count * 0.8, 60);

    return L.divIcon({
      html: `<div style="
        width: ${radius}px;
        height: ${radius}px;
        line-height: ${radius}px;
        border-radius: 50%;
        text-align: center;
        color: black;
        font-weight: bold;
        font-size: ${Math.min(14 + count * 0.15, 24)}px;
      ">${count}</div>`,
      className: `marker-cluster marker-cluster-${sizeClass}`,
      iconSize: [radius, radius],
    });
  },
  spiderfyOnMaxZoom: true,
  showCoverageOnHover: false,
  zoomToBoundsOnClick: true,
});

// highlighted feature variable to reset style on click another feature or map
let featureLayer;
let selectedLayer = null;

//highlight feature on click
let highlightFeature = (ev) => {
  let layer = ev.target;
  // map.fitBounds(ev.target.getBounds());

  if (selectedLayer) {
    featureLayer.resetStyle(selectedLayer);
  }

  // highlight clicked feature
  layer.setStyle({
    color: "#ea03fbc5",
    opacity: 1,
    fillColor: "#c602cd95",
    fillOpacity: 0.4,
    weight: 2,
    dashArray: "5, 5",
  });

  layer.bringToFront();
  selectedLayer = layer;
};

// fetch data from API and add it to the map for polygon
let getData = async function (apiURL, name = "featureLayer") {
  let fetchedData = await fetch(apiURL);
  let myData = await fetchedData.json();
  let myEachLayer = (fet, layer) => {
    if (fet.properties) {
      layer.on({
        click: highlightFeature,
      });

      let myTable = document.createElement("table");
      myTable.classList.add("info-table");
      for (let key in fet.properties) {
        let myTr = document.createElement("tr");
        let myTd = document.createElement("td");
        let myTdva = document.createElement("td");

        myTd.innerHTML = `${key}`;
        myTdva.innerHTML = `${fet.properties[key]}`;
        myTr.appendChild(myTd);
        myTr.appendChild(myTdva);
        myTable.appendChild(myTr);
      }
      layer.bindPopup(myTable);
    }
  };

  featureLayer = L.geoJSON(myData, {
    style: style,
    onEachFeature: myEachLayer,
  });

  myLayerGroup.addOverlay(featureLayer, name);
};

map.on("click", function () {
  if (selectedLayer) {
    featureLayer.resetStyle(selectedLayer);
    selectedLayer = null;
  }
});

getData(
  "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/World_Countries_(Generalized)/FeatureServer/0/query?outFields=FID,COUNTRY,ISO&where=1%3D1&f=geojson",
  "World Countries",
);

// fetch data from API and add it to the map for point
let getDataPoint = async function (apiURL, name = "pointlayer") {
  let fetchedData = await fetch(apiURL);
  let myData = await fetchedData.json();
  let myEachLayer = (fet, layer) => {
    if (fet.properties) {
      let myTable = document.createElement("table");
      myTable.classList.add("info-table");
      for (let key in fet.properties) {
        let myTr = document.createElement("tr");
        let myTd = document.createElement("td");
        let myTdva = document.createElement("td");

        myTd.innerHTML = `${key}`;
        myTdva.innerHTML = `${fet.properties[key]}`;
        myTr.appendChild(myTd);
        myTr.appendChild(myTdva);
        myTable.appendChild(myTr);
      }
      layer.bindPopup(myTable);
    }
  };

  let pointLayer = L.geoJSON(myData, {
    style: style,
    onEachFeature: myEachLayer,
  });

  myLayerGroup.addOverlay(markers.addLayer(pointLayer), name);
};

getDataPoint("WorldCities.geojson", "World Cities");

//////////////////////////////////////////////////////////////////////////

// --> scale control
L.control
  .scale({
    position: "bottomleft",
    maxWidth: 100,
    metric: true,
    imperial: false,
  })
  .addTo(map);

// --> Mouse hover coorindate
let mymouseHover = document.querySelector("#latlng");
map.on("mousemove", (ev) => {
  mymouseHover.innerHTML = `lat:${ev.latlng.lat.toFixed(6)} long:${ev.latlng.lng.toFixed(6)}`;
});

// --> Home button
let myHome = document.querySelector("#home");
myHome.addEventListener("click", () => {
  let homeZoom = 5;
  let homeCenter = [27.0778, 30.10516];
  map.flyTo(homeCenter, homeZoom, { duration: 1, animate: true });
});

// --> Location button
let myLocation = document.querySelector("#locate");
let locationAtive = false;
let myMarker = null;
let firstFix = true;

let onLocationFound = (e) => {
  if (!myMarker) {
    myMarker = L.marker(e.latlng).addTo(map);
  } else {
    myMarker.setLatLng(e.latlng);
  }
  myMarker
    .bindPopup(
      `<p>This is your location</p><b>${e.latlng.lat}° ${e.latlng.lng}°</b>`,
    )
    .openPopup();

  map.flyTo(e.latlng, 17, { duration: 2, animate: true });
};

map.on("locationfound", onLocationFound);

myLocation.addEventListener("click", (e) => {
  if (!locationAtive) {
    myLocation.style.cssText =
      "background-color: rgba(1, 157, 1, 0.6); color: #fff;";
    map.locate({
      setView: false,
      watch: false,
      enableHighAccuracy: true,
      maxZoom: defaultZm,
    });

    locationAtive = true;
  } else {
    myLocation.style.cssText = "background-color: #fff; color: #fff;";

    if (myMarker) {
      map.removeLayer(myMarker);
      myMarker = null;
    }

    map.stopLocate();
    locationAtive = false;
  }
});

// --> Nasa WMS layer date change
let inptDate = document.querySelector("#inptDate");
inptDate.addEventListener("change", (e) => {
  let selectedDate = new Date(e.target.value).toISOString().split("T")[0];
  nasaLayerTerra.setParams({ time: selectedDate });
  nasaLayerAqua.setParams({ time: selectedDate });
});

let fetchBtn = document.querySelector("#fetchBtn");
let fetchData = document.querySelector("#fetchData");
let layerType = document.querySelector("#layerTyp");

// fetch data from API and add it to the map for polygon
let fetchDataPoly = async function (apiURL, name = "featureLayer") {
  let fetchedData = await fetch(apiURL);
  let myData = await fetchedData.json();

  let myEachLayer = (fet, layer) => {
    if (fet.properties) {
      layer.on({
        click: highlightFeature,
      });

      let myTable = document.createElement("table");
      myTable.classList.add("info-table");
      for (let key in fet.properties) {
        let myTr = document.createElement("tr");
        let myTd = document.createElement("td");
        let myTdva = document.createElement("td");

        myTd.innerHTML = `${key}`;
        myTdva.innerHTML = `${fet.properties[key]}`;
        myTr.appendChild(myTd);
        myTr.appendChild(myTdva);
        myTable.appendChild(myTr);
      }
      layer.bindPopup(myTable);
    }
  };

  featureLayer = L.geoJSON(myData, {
    style: style,
    onEachFeature: myEachLayer,
  });

  map.fitBounds(featureLayer.getBounds());
  featureLayer.addTo(map);
  myLayerGroup.addOverlay(featureLayer, name);
};

map.on("click", function () {
  if (selectedLayer) {
    featureLayer.resetStyle(selectedLayer);
    selectedLayer = null;
  }
});

// fetch data from API and add it to the map for point
let fetchDataPoint = async function (apiURL, name = "pointlayer") {
  //Cluster point style
  const markers = L.markerClusterGroup({
    iconCreateFunction: function (cluster) {
      const count = cluster.getChildCount();

      // Determine size class (same logic as default)
      let sizeClass = "small";
      if (count >= 100) {
        sizeClass = "large";
      } else if (count >= 10) {
        sizeClass = "medium";
      }

      // Scale radius based on count
      const radius = Math.min(30 + count * 0.8, 60);

      return L.divIcon({
        html: `<div style="
        width: ${radius}px;
        height: ${radius}px;
        line-height: ${radius}px;
        border-radius: 50%;
        text-align: center;
        color: black;
        font-weight: bold;
        font-size: ${Math.min(14 + count * 0.15, 24)}px;
      ">${count}</div>`,
        className: `marker-cluster marker-cluster-${sizeClass}`,
        iconSize: [radius, radius],
      });
    },
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
  });
  let fetchedData = await fetch(apiURL);
  let myData = await fetchedData.json();

  let myEachLayer = (fet, layer) => {
    if (fet.properties) {
      let myTable = document.createElement("table");
      myTable.classList.add("info-table");
      for (let key in fet.properties) {
        let myTr = document.createElement("tr");
        let myTd = document.createElement("td");
        let myTdva = document.createElement("td");

        myTd.innerHTML = `${key}`;
        myTdva.innerHTML = `${fet.properties[key]}`;
        myTr.appendChild(myTd);
        myTr.appendChild(myTdva);
        myTable.appendChild(myTr);
      }
      layer.bindPopup(myTable);
    }
  };

  let pointLayer = L.geoJSON(myData, {
    style: style,
    onEachFeature: myEachLayer,
  });

  map.fitBounds(pointLayer.getBounds());
  markers.addTo(map);
  myLayerGroup.addOverlay(markers.addLayer(pointLayer), name);
};

fetchBtn.addEventListener("click", () => {
  let url = fetchData.value.trim();
  if (url && url !== "" && layerType.value) {
    let type = layerType.value;
    if (type === "Point") {
      fetchDataPoint(url, "Fetched point");
    } else if (type === "Polygon/Line") {
      fetchDataPoly(url, "Fetched feature");
    }
  }
  fetchData.value = "";
});
