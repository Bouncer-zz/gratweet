var geocoder = new google.maps.Geocoder();
function initialize() {
var mapOptions = {
center: new google.maps.LatLng(52.23, 4.55),
zoom: 8
};
map = new google.maps.Map(document.getElementById("map-canvas"),
mapOptions);
}
google.maps.event.addDomListener(window, 'load', initialize);