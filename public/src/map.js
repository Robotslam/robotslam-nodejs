const map = L.map('map').setView([55.711958, 13.215353], 17);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var working_icon = new L.Icon({
    iconUrl: require('../images/marker-icon.png'),
    iconAnchor: new L.Point(12, 41)
    // iconSize:    [25, 41],
    // iconAnchor:  [12, 41],
    // popupAnchor: [1, -34],
    // tooltipAnchor: [16, -28],
    // shadowSize: [41, 41]
});

let center = null;
let corner = null;
document.querySelector("#move-to-center").onclick = function (ev) {

}

center = new L.marker([55.711958, 13.215353], {
    draggable: true,
    icon: working_icon
}).addTo(map);

corner = new L.marker([55.711958, 13.215353], {
    draggable: true,
    icon: working_icon
}).addTo(map);


/*var imageUrl = 'http://www.lib.utexas.edu/maps/historical/newark_nj_1922.jpg',
    imageBounds = [[55.711, 13.21], [55.711969, 13.215357]];

L.imageOverlay(imageUrl, imageBounds, {opacity: 0.7}).addTo(map);*/
