/* JS DIRECTORY
    1. =VARIABLES
    2. =FETCH
    3. =INPUT
    4. =DISPLAY
    5. =STORAGE
*/

/* ===VARIABLES=== */

// Section element variables
var cityInputEl = $('#city-input');
var searchButtonEl = $('#search-button');
var searchHistoryEl = $('#search-history');

var selectedCityNameEl = $('#selected-city-name');
var selectedCity;

var dateEls = $('.date');
var iconEls = $('.icon');
var temperatureEls = $('.temperature');
var windEls = $('.wind');
var humidityEls = $('.humidity');
var uvEl = $('#UV');

/* ===FETCH=== */

// Get weather data


/* ===INPUT=== */

// When user starts typing input field, show dropdown list of available cities based on API
$(function () {
    // get city names from API
    var cityNames = [];

    cityInputEl.autocomplete({
      source: cityNames,
    });
  });

// When search button is clicked, set user's input as selected city
searchButtonEl.on('submit', selectCity);

function selectCity() {
    selectedCity = selectedCityNameEl.val();

    if (!(selectedCity in cityNames)) {
        return;
    }

    selectedCityNameEl.val('');

    showWeather();
}


/* ===DISPLAY=== */

// Show weather data for selected city
function showWeather() {

}

// Set display of UV element based on value of UV index 


/* ===STORAGE=== */

// Save city in local storage 


// Display city in search history 



// When clicked, set clicked city as selected city and show weather data
