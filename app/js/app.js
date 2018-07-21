// Google Maps object
map = {};

function initMap() {
  console.log('initMap');
}

function handleMapsAPIError() {
  console.log('error');
}

function appViewModel(arr) {

  var self = this;

  self.searchString = '';

  // - dirty hack to refresh observable arrays
  //   https://stackoverflow.com/questions/13231738
	ko.observableArray.fn.refresh = function () {
    var data = this();
    this(null);
    this(data);
	}

  // - create the markers list, which is observable
  // - set titles and visibility
  // - the individual array elements are not observable
  //   and require the refresh function to trigger a
  //   re-render when the properties are updated
  self.initMarkers = function() {
    self.markers = ko.observableArray(arr);

    ko.utils.arrayForEach(self.markers(), (function(marker) {
      if (marker.arttype == "gallery") {
        marker.title = marker.gallery;
      } else if (marker.arttype == "statue") {
        marker.title = marker.title;
      }
      marker.isVisible = true;
    }));
    self.markers.refresh();

    // todo: remove all untitled elements
    //self.markers = markers.filter(marker => marker.title != "");
  }
  self.initMarkers();

  // - update the vsibility of all markers
  // - acceptable operations are strings:
  //   - show_all
  //   - show_none
  //   - statue
  //   - gallery
  //   - any other strings will be treated as search results
  self.updateMarkers = function(op) {
    if (op == 'show_all') {
      ko.utils.arrayForEach(self.markers(), function(marker) {
        marker.isVisible = true;
      });
    } else if (op == 'show_none') {
      ko.utils.arrayForEach(self.markers(), function(marker) {
        marker.isVisible = false;
      });
    } else if (op == 'statue' || op == 'gallery') {
      ko.utils.arrayForEach(self.markers(), function(marker) {
        if (marker.arttype == op) {
          marker.isVisible = true;
        } else {
          marker.isVisible = false;
        }
      });
    } else {
      ko.utils.arrayForEach(self.markers(), function(marker) {
        if (marker.title.includes(op)) {
          marker.isVisible = true;
        } else {
          marker.isVisible = false;
        }
      });
    }
    self.markers.refresh();
  }

  // - display dropdown menu
  self.artType = ['All','Galleries','Sculptures','None'];
  self.artTypeToShow = ko.observable();

  // - handle dropdown menu selections
  self.onArtTypeChange = function(d, e) {
    if (e.target.value == 'Galleries') {
      self.updateMarkers('gallery');
    } else if (e.target.value == 'Sculptures') {
      self.updateMarkers('statue');
    } else if (e.target.value == 'All') {
      self.updateMarkers('show_all');
    } else if (e.target.value == 'None') {
      self.updateMarkers('show_none');
    }
  }

  // - display search box
  self.searchString = ko.observable('');

  // - handle search box input text

  self.onSearchStringChange = function() {
    self.updateMarkers(self.searchString());
  }
}

// - bind the ViewModel and pass in the
//   backup data in case the API call fails
// - locations array is from ./locations.js
ko.applyBindings(appViewModel(locations));
