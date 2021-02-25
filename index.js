function geoFindMe() {
    const status = document.querySelector('#status');
    const mapLink = document.querySelector('#map-link');
    mapLink.href = '';
    mapLink.textContent = '';

    function success(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        status.textContent = '';
        mapLink.href = `https:var MapIframe=`
        https: mapLink.innerHTML = `Latitude:${latitude}°,Longitude:${longitude}°`;
        mapLink.classList.add("map-link");
    }

    function error() {
        status.textContent = 'Unable to retrieve your location';
    }
    if (!navigator.geolocation) {
        status.textContent = 'Geolocation is not supported by your browser';
    } else {
        status.textContent = 'Locating…';
        navigator.geolocation.getCurrentPosition(success, error);
    }
}
document.querySelector('#find-me').addEventListener('click', geoFindMe);
mapboxgl.accessToken = 'pk.eyJ1IjoibmlybWl0MTUyMSIsImEiOiJja2xpYXptZnIwMXRkMnJvYjRtcTU0bHMyIn0.WMIXiq85Wx3LX7RvSpt1pg';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [77.1139872, 28.631576225990372],
    zoom: 18
});
map.addControl(new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    localGeocoder: coordinatesGeocoder,
    zoom: 4,
    placeholder: 'Try: -40, 170',
    mapboxgl: mapboxgl
}));map.addControl(new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true
}));
map.addControl(new mapboxgl.NavigationControl());

var coordinatesGeocoder = function (query) {
    var matches = query.match(/^[ ]*(?:Lat: )?(-?d+.?d*)[, ]+(?:Lng: )?(-?d+.?d*)[ ]*$/i);
    if (!matches) {
        return null;
    }

    function coordinateFeature(lng, lat) {
        return {
            center: [lng, lat],
            geometry: {
                type: 'Point',
                coordinates: [lng, lat]
            },
            place_name: 'Lat: ' + lat + ' Lng: ' + lng,
            place_type: ['coordinate'],
            properties: {},
            type: 'Feature'
        };
    }
    var coord1 = Number(matches[1]);
    var coord2 = Number(matches[2]);
    var geocodes = [];
    if (coord1 < -90 || coord1 > 90) {
        geocodes.push(coordinateFeature(coord1, coord2));
    }
    if (coord2 < -90 || coord2 > 90) {
        geocodes.push(coordinateFeature(coord2, coord1));
    }
    if (geocodes.length === 0) {
        geocodes.push(coordinateFeature(coord1, coord2));
        geocodes.push(coordinateFeature(coord2, coord1));
    }
    return geocodes;
};
