// Google Maps object
map = {};

function appViewModel(arr) {

  var self = this;

  markers = arr;

  // add showVisible attribute to each item in markers
  // and set the title attribute according to the entry type
  markers.forEach(function(marker) {
    marker.showMarker = "true";
    if (marker.arttype == "gallery") {
      marker.title = marker.gallery;
    } else if (marker.arttype == "statue") {
      marker.title = marker.title;
    } else {
      marker.title = "";
      marker.showMarker = false;
    }
  });

  console.log(markers);
}

// instantiate with backup data in case the API call fails
// locations is from ./locations.js
ko.applyBindings(appViewModel(locations));
