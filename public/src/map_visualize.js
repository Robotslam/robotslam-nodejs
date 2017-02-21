if (document.getElementById('map-visualize') !== null) {
  const tileLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  });

  const start_lat = 13.215353;
  const start_lng = 55.711958;

  const map = L.map('map-visualize', {
    center: [start_lng, start_lat],
    zoom: 19,
    maxZoom: 19,
    layers: [tileLayer]
  });

  window.map = map;

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

  const coords = JSON.parse(document.getElementById('visualize-data').innerText);

  /*window.working_icon = working_icon;
  window.coord = coords[0];
  L.marker(coords[0], {icon: working_icon}).addTo(map);*/
  /*coords.forEach((coord) => {
    L.marker(coord, {icon: working_icon}).addTo(map);
  });*/
  var polyline = L.polyline(coords, {color: 'red'}).addTo(map);
}
