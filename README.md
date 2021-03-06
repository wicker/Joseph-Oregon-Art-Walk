# Joseph Art Walk

This app uses [Knockout.js](http://knockoutjs.com/), the [Joseph Art Walk API](https://api.josephartwalk.org/), and the [Google Maps API](https://developers.google.com/maps/documentation/javascript/tutorial) to show the locations and some background information on the bronze statues and art galleries along Main Street in Joseph, Oregon.

&raquo; ~Click here for a live demo~

## Usage

1. Download this [zip file](https://github.com/wicker/Joseph-Oregon-Art-Walk/raw/master/release/app-v1.0.zip) or clone the git repository.
1. Open index.html in your browser.

## Screenshot

![Screenshot](docs/screenshot.png)

## Why KnockoutJS?

KnockoutJS works on the MVVM design pattern where the UI is separated into three parts:

1. The **model** consists of the list of gallery and statue locations with artist info, verbose location, latitude and longitude, title, and other supporting information. 

1. The **view** consists of the UI in the webpage seen by the end user, namely the map object and its properties (size, popup info windows, markers), a list of locations in text form, and a search box and dropdown menu for the user to filter that list. 

1. The **view-model** binds the model and view so the user can make updates to the model through the view's search box an dropdown menu; any updates to the model are immediately reflected in the view for the user to see. 

## Feature Requirements

### Model

The call to the [Joseph Art Walk API](https://api.josephartwalk.org) returns a list of locations, which are stored in the global `locations` object and used to instantiate the ViewModel.

|Example Property|Example Value|
|----------------|-------------|
|artist|"Ramon Parmenter"|
|artistURL|"http://josephoregon.com/ramon-parmenter"|
|location|"in front of The Dog Spot"|
|lat|45.35149|
|lng|-117.229985|
|corner|"1st St and Main St"|
|medium|"bronze"|
|title|"Garden Walk"|
|imgSrc|""|
|imgAttribution|""|
|imgLicense|""|
|imgLicenseLink|""|
|arttype|"statue"|

### View

The page is a responsive, mobile-first design.

This is a single page application.

The color palette was generate from [Material-UI](https://material-ui.com/style/color/):

![Material UI Color Palette](docs/material-colors.png)

The font is Roboto from Google Fonts.

The user interface items in the view are:

- Header with centered title
- Section for app introduction
- Google map to display markers
- Search box
- Dropdown menu
  - All
  - Galleries
  - Statues
  - None
- Unordered list of locations
- Footer

### View-Model

The map must be no more than the height and width of the screen. The user must be able to continue scrolling on the page and not get hung up in the map. Whenever it is updated, the map must update its bounds.

Clicking on a map marker must show an infoWindow. 

The list of all locations must be displayed on a vertical list. 

Tapping on a marker or on a list item must activate that specific marker animation and show the info window of that marker in the map window.

Tapping again on the same marker or list item must activate the animation again and hide the info window of that marker in the map window. 

The search box must, with every typed character, filter the visible map markers and the list of items in the locations list. 

The dropdown menu must also filter the visible map markers and the list of items in the locations list. 

There must be an additional graphic to reset all inputs. 

## Screenshots

`commit #eed94b0: feat: Add basic html and css [view]` 

![Commit #eed94b0](docs/progress-commit-eed94b0-view.png)

`commit #752ea83: feat: Create and bind markers list [mv]`

![Commit #752ea83](docs/progress-commit-752ea83-view.png)

The observable arrays in Knockout are only observable at the level of the array themselves, so the View-Model will know to re-render the array if an element is added or removed, but not if an element is changed. The elements themselves are not observable. The trick is a somewhat dirty hack from [this StackOverflow question](https://stackoverflow.com/questions/13231738/refresh-observablearray-when-items-are-not-observables).

`commit #22c3721: feat: Manage observable markers array, update list`

![Commit #22c3721](docs/progress-commit-22c3721-view.png)

The displayed list of statues and galleries now refreshes smoothly with every keystroke in the search box. 

`commit #bd8f273: feat: Add and bind the search box`

![Commit #bd8f273](docs/progress-commit-bd8f273-view.png)

Once the two asynchronous API calls are working, the blank map is visible and the rest of the functions are prototyped to return strings to console.log() and the program architecture is finalized. 

Both calls are asynchronous, but the Google Maps API callback `initMap` binds the ViewModel, which itself calls the Joseph Art Walk API. If the Maps API call fails, though, the rest of the app never loads, which is a problem. 

`commit #fa02e10: refactor: Prototype remaining functions`

![Commit #fa02e10](docs/progress-commit-fa02e10-view.png)

Initializing the list of markers, which now lives in `AppViewModel`, happens now in its own separate function, `initMarkers`, that creates each marker member with everything needed by both the filtered list and the map. 

```
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
```

It's an ongoing struggle to get KnockoutJS to observe the 'visible' tag in the list of markers, so for the moment the hacky refresh technique to refresh the entire array is in place. The `updateMarkers` function is called by each keystroke in the search box or by a selection in the dropdown menu, and all it does is set the `visible` property on each `marker` accordingly.

`commit #880223a: feat: Filter map and list`

![Commit #880223a](docs/progress-commit-880223a-view.png)

The filtered list looks much better after applying CSS `display: grid` properties and adding a placeholder image until we can grab the iamges from the Joseph Art Walk API. The filtered list doesn't look good on mobile yet, but that will be easy to fix by applying mobile queries to the filtered list grid.

`commit #a9de359: feat: Add CSS grid to filtered list`

Some internal refactoring of self/this and removing logging statements makes the code cleaner. The log statements were used to examine the marker object as it was manipulated by different user inputs.  

`commit #73728a0: refactor: Fix this/self, remove console.log`

Because users might be entering text to the search box on a laptop or on their phones, it's best to make the search results case-insensitive. This is done by comparing the lower case marker title to the lower case search string.

```
if (marker.title.toLowerCase().includes(op.toLowerCase())) {
	marker.visible = true;
} else {
	marker.visible = false;
}
```

`commit #4fbffb4: feat: Make search case-insensitive`

![Commit #4fbffb4](docs/progress-commit-4fbffb4-view.png)


