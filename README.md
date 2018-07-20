# Joseph Art Walk

This app uses [Knockout.js](http://knockoutjs.com/), the [Joseph Art Walk API](https://api.josephartwalk.org/), and the [Google Maps API](https://developers.google.com/maps/documentation/javascript/tutorial) to show the locations and some background information on the bronze statues and art galleries along Main Street in Joseph, Oregon.

## Why KnockoutJS?

KnockoutJS works on the MVVM design pattern where the UI is separated into three parts:

1. The **model** consists of the list of gallery and statue locations with artist info, verbose location, latitude and longitude, title, and other supporting information. 

1. The **view** consists of the UI in the webpage seen by the end user, namely the map object and its properties (size, popup info windows, markers), a list of locations in text form, and a search box and dropdown menu for the user to filter that list. 

1. The **view-model** binds the model and view so that the user can make updates to the model through the view's user interface (search box, dropdown menu) and any updates to the model are immediately reflected in the view for the user to see. 


