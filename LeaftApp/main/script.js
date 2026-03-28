let myMap = document.querySelector("#map");
// https://ows.mundialis.de/osm/service?SERVICE=WMS&REQUEST=GetCapabilities
// --> MAP
// -----------------------------------------------------------------
// --> 1- Creation
let defaultZm = 6;
let zoomDelta = 0.5;
let zoomSnp = 0;
let minZm = 2;
let maxZm = 19;
let mapCenter = [27.0778, 30.10516];
let southWest = L.latLng(20.0, 20.0);
let northEast = L.latLng(38.0, 38.0);
let egyptBounds = L.latLngBounds(southWest, northEast);

// --> Basemap
let nasaLayerTerra = L.tileLayer.wms(
  "https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi",
  {
    layers: "MODIS_Terra_CorrectedReflectance_TrueColor",
    // layers: "MODIS_Aqua_CorrectedReflectance_TrueColor",
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

let osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  zoom: defaultZm,
  minZoom: minZm,
  maxZoom: maxZm,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
});

let esriImg = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    zoom: defaultZm,
    minZoom: minZm,
    maxZoom: maxZm,
    attribution:
      '&copy; <a href="http://www.arcgis.com/home/item.html?id=10df2279f9664e839f6fec3cb4adeba4">ArcGIS</a>',
  },
);

let Google_Maps = L.tileLayer(
  "https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}",
  {
    zoom: defaultZm,
    minZoom: minZm,
    maxZoom: maxZm,
    attribution: '&copy; <a href="http://www.google.com">Google</a>',
  },
);

let osmHOT = L.tileLayer(
  "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
  {
    zoom: defaultZm,
    minZoom: minZm,
    maxZoom: maxZm,
    attribution:
      "© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France",
  },
);

let baseMaps = {
  "NASA GIBS Terra": nasaLayerTerra,
  "NASA GIBS Aqua": nasaLayerAqua,
  OpenStreetMap: osm,
  "OpenStreetMap.HOT": osmHOT,
  "Esri World Imagery": esriImg,
  "Google Maps": Google_Maps,
};

let map = L.map("map", {
  // crs: L.CRS.EPSG4326,
  center: mapCenter,
  zoom: defaultZm,
  zoomDelta: zoomDelta,
  zoomSnap: zoomSnp,
  minZoom: minZm,
  maxZoom: maxZm,
  zoomControl: true,
  attributionControl: true,
  dragging: true,
  scrollWheelZoom: true,
  doubleClickZoom: true,
  basemap: osm,
  // maxBounds: egyptBounds,
  // maxBoundsViscosity: 4, // Prevents panning outside the borders [1, 4]
});

let layerControl = L.control.layers(baseMaps).addTo(map);

// nasaLayerTerra.addTo(map);

let inptDate = document.querySelector("#inptDate");
inptDate.addEventListener("change", (e) => {
  let selectedDate = new Date(e.target.value).toISOString().split("T")[0];
  nasaLayerTerra.setParams({ time: selectedDate });
  nasaLayerAqua.setParams({ time: selectedDate });
});

// let onMapClick = (e) => {
//   L.marker(e.latlng)
//     .addTo(map)
//     .bindPopup("<b>Hello!</b><br>" + e.latlng.toString());
//   console.log("You clicked the map at " + e.latlng.toString());
// };

// map.on("click", onMapClick);

// let latlngs = [
//   [29.0778, 31.10516],
//   [29.0778, 31.10536],
//   [29.0788, 31.10526],
//   [29.0788, 31.105106],
// ];

// let polyline = L.polygon(latlngs, {
//   color: "blue",
//   fillColor: "#f03",
//   fillOpacity: 0.3,
//   opacity: 0.5,
//   smoothFactor: 1,
//   dashArray: "20, 5",
// });

// let polygon = L.polygon(latlngs, {
//   color: "blue",
//   fillColor: "#f03",
//   fillOpacity: 0.3,
//   opacity: 0.5,
// }).bindPopup("Area Name");

// let myCircle = L.circle([29.0788, 31.105106], {
//   color: "blue",
//   fillColor: "green",
//   fillOpacity: 0.2,
//   opacity: 0.5,
//   radius: 500,
//   smoothFactor: 1000,
// })
//   .addTo(map)
//   .bindPopup("sdaad");

// let states = [
//   {
//     type: "Feature",
//     properties: { party: "Republican" },
//     geometry: {
//       type: "Polygon",
//       coordinates: [
//         [
//           [-104.05, 48.99],
//           [-97.22, 48.98],
//           [-96.58, 45.94],
//           [-104.03, 45.94],
//           [-104.05, 48.99],
//         ],
//       ],
//     },
//   },
//   {
//     type: "Feature",
//     properties: { party: "Democrat" },
//     geometry: {
//       type: "Polygon",
//       coordinates: [
//         [
//           [-109.05, 41.0],
//           [-102.06, 40.99],
//           [-102.03, 36.99],
//           [-109.04, 36.99],
//           [-109.05, 41.0],
//         ],
//       ],
//     },
//   },
// ];

// L.geoJSON(states, {
//   style: (feature) => {
//     switch (feature.properties.party) {
//       case "Republican":
//         return { color: "#ff0000" };
//       case "Democrat":
//         return { color: "#0000ff" };
//     }
//   },
// })
// .addTo(map)
// .bindPopup((layer) => `${layer.feature.properties.party}`);

let getColor = (d) => {
  return d > 1000
    ? "#800026"
    : d > 500
      ? "#BD0026"
      : d > 200
        ? "#E31A1C"
        : d > 100
          ? "#FC4E2A"
          : d > 50
            ? "#FD8D3C"
            : d > 20
              ? "#FEB24C"
              : d > 10
                ? "#FED976"
                : "#FFEDA0";
};

let style = (feature) => {
  return {
    fillColor: getColor(feature.properties.density),
    weight: 2,
    opacity: 1,
    color: "white",
    dashArray: "3",
    fillOpacity: 0.7,
  };
};

let zoomToFeature = (e) => {
  map.fitBounds(e.target.getBounds());
};

let onEachFeature = (feature, layer) => {
  layer.on({
    click: zoomToFeature,
  });
};

//  fetch("US_pop.geojson")
//   .then((response) => response.json())
//   .then((data) => {
//     L.geoJSON(data, { style: style, onEachFeature: onEachFeature }).addTo(map);
//     // .bindPopup(
//     //   (layer) =>
//     //     `<b>${layer.feature.properties.name}</b><br>${layer.feature.properties.density} people/mi<sup>2</sup> `,
//     // );
//   });

let openTopoMap = L.tileLayer(
  "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
  {
    maxZoom: 19,
    attribution:
      "Map data: © OpenStreetMap contributors, SRTM | Map style: © OpenTopoMap (CC-BY-SA)",
  },
);

layerControl.addBaseLayer(openTopoMap, "OpenTopoMap");

async function loadData() {
  const response = await fetch("US_pop.geojson");
  const data = await response.json();

  let usaPolygon = L.geoJSON(data, {
    style: style,
    onEachFeature: onEachFeature,
  }).addTo(map);
  layerControl.addOverlay(usaPolygon, "USA");
}

loadData();

L.control.scale().addTo(map);

// setInterval(function () {
//   map.setZoom(0);
// }, 4000);

let getData = async function (apiURL) {
  let fetchedData = await fetch(apiURL);
  let myData = await fetchedData.json();
  let egyptLayer = L.geoJSON(myData).addTo(map);
  layerControl.addOverlay(egyptLayer, "EGY");
};

getData("EGY-GOVS.geojson"); // "EGY-GOVS";
