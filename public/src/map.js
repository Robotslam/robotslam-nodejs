// Only load script if map exists
if (document.getElementById('map') !== null) {

  const start_lng = 55.711958;
  const start_lat = 13.215353;

  const tileLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  });

  const map = L.map('map', {
    center: [start_lng, start_lat],
    zoom: 19,
    maxZoom: 19,
    layers: [tileLayer]
  });

  // Load Micello
  L.micello.loader.on('indoorReady', function (e) {
    const micelloCommunity = L.micello.community(11858, {
      key: 'hmtllTp8kPFOPy0FZKOH6kU7nHO5Ep',
      centerCommunity: true
    });

    micelloCommunity.addTo(map);

    micelloCommunity.on('indoorClick', function (e) {
      if (e && e.indoor && e.indoor.id) {
        clickHandler();
      }
    });
  });

  const working_icon = new L.Icon({
    iconUrl: require('../images/marker-icon.png'),
    iconAnchor: new L.Point(12, 41)
    // iconSize:    [25, 41],
    // iconAnchor:  [12, 41],
    // popupAnchor: [1, -34],
    // tooltipAnchor: [16, -28],
    // shadowSize: [41, 41]
  });

  const image_tag = document.querySelector("#map-image");
  window.image_tag = image_tag;
  const image_src = image_tag.getAttribute("src");
  const gps_references = eval(image_tag.getAttribute('data-gps-references'));
  const origin = eval(image_tag.getAttribute('data-origin'));
  const resolution = eval(image_tag.getAttribute('data-resolution'));

  const topleft = L.latLng(40.52256691873593, -3.7743186950683594),
    topright = L.latLng(40.5210255066156, -3.7734764814376835),
    bottomleft = L.latLng(40.52180437272552, -3.7768453359603886);

  const marker1 = L.marker(topleft, {draggable: true, icon: working_icon}).addTo(map),
    marker2 = L.marker(topright, {draggable: true, icon: working_icon}).addTo(map),
    marker3 = L.marker(bottomleft, {draggable: true, icon: working_icon}).addTo(map),
    marker4 = L.marker(topleft, {draggable: true, icon: working_icon}).addTo(map);

  const overlay = L.imageOverlay.rotated(image_src, topleft, topright, bottomleft, {
    opacity: 1,
    interactive: true,
    attribution: "&copy; <a href='http://robot.oscarhinton.com'>The RobotSLAM Office</a>"
  });
  overlay.addTo(map);

  document.querySelector('#map-submit').onsubmit = (e) => {
    e.preventDefault();

    const input = document.querySelector('input[name="coordinates"]');

    const out = {
      topleft: overlay._topLeft,
      topright: overlay._topRight,
      bottomleft: overlay._bottomLeft,
    };

    input.value = JSON.stringify(out);

  };

  function moveToCenter(center, no_repos_center) {
    const map_width_meters = image_tag.naturalWidth * resolution;
    const map_height_meters = image_tag.naturalHeight * resolution;

    const width_box = center.toBounds(map_width_meters);
    const lng_left = width_box.getWest();
    const lng_right = width_box.getEast();

    const height_box = center.toBounds(map_height_meters);
    const lat_top = height_box.getNorth();
    const lat_bottom = height_box.getSouth();

    const topleft = L.latLng(lat_top, lng_left),
      topright = L.latLng(lat_top, lng_right),
      bottomleft = L.latLng(lat_bottom, lng_left);
    //topleft, topright, bottomleft

    marker1.setLatLng(topleft);
    marker2.setLatLng(topright);
    marker3.setLatLng(bottomleft);
    repositionImageAfterMarkers(no_repos_center);
    //overlay.reposition(topleft, topright, bottomleft);
  }

  function repositionImageAfterMarkers(no_repos_center) {
    overlay.reposition(marker1.getLatLng(), marker2.getLatLng(), marker3.getLatLng());
    if (!no_repos_center) {
      repositionCenterMarker(topleft, topright, bottomleft);
    }
  }

  function repositionCenterMarker(topleft, topright, bottomleft) {
    marker4.setLatLng(new L.LatLngBounds(topleft, topright).extend(bottomleft).getCenter());
  }

  function repositionImageAfterCenterMarker(ev) {
    const center = ev.latlng;
    moveToCenter(center, false);
  }

  marker1.on('drag dragend', repositionImageAfterMarkers);
  marker2.on('drag dragend', repositionImageAfterMarkers);
  marker3.on('drag dragend', repositionImageAfterMarkers);
  marker4.on('drag', repositionImageAfterCenterMarker);

// let center = null;
// let corner = null;
// /*let center = new L.marker([55.711958, 13.215353], {
//     draggable: true,
//     icon: working_icon
// }).addTo(map);

// let corner = new L.marker([55.711958, 13.215353], {
//     draggable: true,
//     icon: working_icon
// }).addTo(map);*/

  document.querySelector("#move-to-center").onclick = function (ev) {
    moveToCenter(map.getCenter(), true);
  };

  if (gps_references) {
    //Already have references, add them here
  } else {
    moveToCenter(map.getCenter(), true);
  }

// const image_overlay = L.imageOverlay(image_src, [[55.711, 13.21], [55.711969, 13.215357]], {opacity: 0.7}).addTo(map);

// window.image_tag = image_tag;

// if (gps_references) {
//   //Already have references, add them here
// } else {
//   center = new L.marker([start_lng, start_lat], {
//       draggable: true,
//       icon: working_icon
//   }).addTo(map);

//   const map_width_meters = image_tag.naturalWidth * resolution[0];
//   const map_height_meters = image_tag.naturalHeight * resolution[1];

//   // Get the y,x dimensions of the map
//   const y = map.getSize().y,
//         x = map.getSize().x;
//   // calculate the distance the one side of the map to the other using the haversine formula
//   const max_meters = map.containerPointToLatLng([0, y]).distanceTo( map.containerPointToLatLng([x,y]));
//   // calculate how many meters each pixel represents
//   const pixel_per_meter = x/max_meters;

//   corner = new L.marker([start_lng + 0.001, start_lat + 0.001], {
//     draggable: true,
//     icon: working_icon
//   }).addTo(map);

//   corner.on('drag', function (ev) {
//     // Object { originalEvent: mousemove, type: "drag", target: Object, latlng: Object, oldLatLng: Object }

//   });
// }

// function updateImageOverlay() {
//   corner.getLatLng()
//   center.getLatLng()
//   imageBounds = [center.getLatLng(), [55.711969, 13.215357]];
//   image_overlay.setBounds(<LatLngBounds> bounds)
// }

// /*var imageUrl = 'http://www.lib.utexas.edu/maps/historical/newark_nj_1922.jpg',
//     imageBounds = [[55.711, 13.21], [55.711969, 13.215357]];*/

}
