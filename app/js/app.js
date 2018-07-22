// define globals
var map;
var bounds;
var infoWindow;

// this is a callback function for Google Maps API
// - create Google Maps map, bounds, and infoWindow
// - bind to the ViewModel and pass in the backup data
// TODO: remove backup data, leave map empty if API call fails
function initMap() {

  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 45.3536044, lng: -117.2287397},
    zoom: 16
  });

  bounds = new google.maps.LatLngBounds();

  infoWindow = new google.maps.InfoWindow();

}

// handle Google Maps API errors
function handleMapsAPIError() {
  console.log('Google Maps API error');
}

// todo: add error handling
function fetchJosephArtAPI() {

  artWalkAPIMarkers = [];
  var request = new XMLHttpRequest();

  request.open('GET', 'https://api.josephartwalk.org/art');

  request.onload = function() {

    var data = JSON.parse(this.response);

    data.art.forEach(item => {
      artWalkAPIMarkers.push(item);
    });

    initMarkers(artWalkAPIMarkers);

  }
  request.send();

}

// handle Joseph Art Walk API errors
function handleJosephArtAPIError() {
  console.log('Joseph Art Walk API error');
}

// initalize the list of markers
// -----------------------------
// the master list of markers might need to be global
// it should contain all the properties needed by
// - google maps to display marker, bounds, and infoWindow
// - filteredList to display image, artist info, title, etc
// it should contain an observable visible property so
//   KnockoutJS knows to refresh the page when that is changed
function initMarkers(artAPIList) {

  var idCount = 0;
  var marker;
  var mapMarker;

  ko.utils.arrayForEach(artAPIList, (function(artListItem) {

    // prepare all the vars we'll need
    idCount = idCount + 1;
    marker = {};

    if (artListItem.arttype == "gallery") {
      marker.title = artListItem.gallery;
      marker.description = 'Located ' + artListItem.location + '.';
      marker.url = artListItem.galleryURL;
      marker.imgSrc = '';
      marker.imgAlt = '';
    }
    else if (artListItem.arttype == "statue") {
      marker.title = artListItem.title;
      marker.artist = artListItem.artist;
      marker.imgSrc = artListItem.imgSrc;
      marker.imgAlt = artListItem.imgAttribution;
      marker.description = artListItem.title + ' by ' + artListItem.artist
                           + ' is a ' + artListItem.medium + ' ' + artListItem.arttype
                           + ' at ' + artListItem.corner
                           + ' ' + artListItem.location + '.';
      marker.url = artListItem.artistURL;
    }

    marker.arttype = artListItem.arttype;

    // google maps needs these in the marker
    marker.position = {'lat':artListItem.lat,
                       'lng':artListItem.lng};
    marker.animation = google.maps.Animation.DROP;
    marker.id = idCount;
    marker.map = map;
    marker.visible = ko.observable(true);

    // now build the actual maps-compatible markers
    mapMarker = new google.maps.Marker({
      animation: marker.animation,
      arttype: marker.arttype,
      desc: marker.description,
      id: marker.id,
      imgSrc: marker.imgSrc,
      imgAlt: marker.imgAlt,
      map: marker.map,
      position: marker.position,
      title: marker.title,
      url: marker.url,
      visible: marker.visible()
    });

    // and push it to the global markers list
    markers().push(mapMarker);

    mapMarker.addListener('click', function() {
      animateMarker(this);
      populateInfoWindow(this, infoWindow);
    });

  }));
  markers.refresh();
}

// - update the visibility of all markers
// - acceptable operations are strings:
//   - show_all
//   - show_none
//   - statue
//   - gallery
//   - any other strings will be treated as search results
// change visible property where appropriate
// force a refresh of the map and its markers
// - clear map
// - setMap and bounds.extend for each item
// - map.fitBounds when finished for the whole map
function updateMarkers(op) {

  // update the visible property on each marker
  // which knockout will observe and update on the list
  if (op == 'show_all') {
    ko.utils.arrayForEach(markers(), function(marker) {
      marker.visible = true;
    });
  } else if (op == 'show_none') {
    ko.utils.arrayForEach(markers(), function(marker) {
      marker.visible = false;
    });
  } else if (op == 'statue' || op == 'gallery') {
    ko.utils.arrayForEach(markers(), function(marker) {
      if (marker.arttype == op) {
        marker.visible = true;
      } else {
        marker.visible = false;
      }
    });
  } else {
    ko.utils.arrayForEach(markers(), function(marker) {
      if (marker.title.toLowerCase().includes(op.toLowerCase())) {
        marker.visible = true;
      } else {
        marker.visible = false;
      }
    });
  }

  // show only visible markers on the Google Map
  ko.utils.arrayForEach(markers(), function(marker) {
    if (marker.visible) {
      marker.setMap(map);
      bounds.extend(marker.position);
      map.fitBounds(bounds);
    } else {
      marker.setMap(null);
    }
  });

  markers.refresh();
}

// populate the info window
function populateInfoWindow(marker, infoWindow) {

  if (infoWindow.marker != marker) {
    infoWindow.marker = marker;
  }

  infoWindowContent = marker.desc;

  infoWindow.setContent(infoWindowContent);

  infoWindow.open(map, marker);

}

// animate a marker
// - bounce
function animateMarker (marker) {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
      marker.setAnimation(null);
    }, 2000);
  }
}

function appViewModel() {

  var self = this;

  self.markers = ko.observableArray([]);

	ko.observableArray.fn.refresh = function () {
    var data = this();
    this(null);
    this(data);
  }

  self.searchString = '';

  fetchJosephArtAPI();

  // - display dropdown menu
  self.artType = ['All','Galleries','Sculptures','None'];
  self.artTypeToShow = ko.observable();

  // - handle dropdown menu selections
  self.onArtTypeChange = function(d, e) {
    if (e.target.value == 'Galleries') {
      updateMarkers('gallery');
    } else if (e.target.value == 'Sculptures') {
      updateMarkers('statue');
    } else if (e.target.value == 'All') {
      updateMarkers('show_all');
    } else if (e.target.value == 'None') {
      updateMarkers('show_none');
    }
  }

  // - display search box
  self.searchString = ko.observable('');

  // - handle search box input text
  self.onSearchStringChange = function() {
    updateMarkers(self.searchString());
  }
}

// - bind the ViewModel and pass in the
//   backup data in case the API call fails
// - locations array is from ./locations.js
ko.applyBindings(appViewModel());

