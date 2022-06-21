/* JS DIRECTORY
    1. =VARIABLES
    2. =INPUT
    3. =DISPLAY
    4. =STORAGE
*/

/* ===VARIABLES=== */

// Section element variables
var cityInputEl = $('#city-input');
var searchButtonEl = $('#search-button');
var searchHistoryEl = $('#search-history');

var selectedCityNameEl = $('#selected-city-name');
var selectedCity;
var selectedCityLatitude;
var selectedCityLongitude;

var time = moment();
var currentTimeSelectedCity;

var icon;
var temperature;
var wind;
var humidity;
var uv;

var dateTodayEl = $('#date-today');
var temperatureTodayEl = $('#temperature-today');
var windTodayEl = $('#wind-today');
var humidityTodayEl = $('#humidity-today');
var uvTodayEl = $('#UV-today');


var dateEls = $('.date');
var iconEls = $('.icon');

var temperatureForecastEls = $('.temperature');
var windForecastEls = $('.wind');
var humidityForecastEls = $('.humidity');

var apiKey = "88752a63ac29da05bb412d9600126dcf";

/* ===INPUT=== */

// When user starts typing input field, show dropdown list of available cities based on API
// $(function () {
    // get city names from API
    // var cityNames = [];

    // cityInputEl.autocomplete({
    //  source: cityNames,
    // });
  // });

// When search button is clicked, set user's input as selected city
searchButtonEl.on('click', selectCity);

function selectCity(event) {
    event.preventDefault();

    selectedCity = cityInputEl.val().trim();

    // change to pop-up
    if (!selectedCity) {
        alert('You need to select a city!');
        return;
    }

    cityInputEl.val('');

    getLatLon();
}

// Get latitude and longitude of selected city
function getLatLon() {
    var apiURL = 'http://api.openweathermap.org/geo/1.0/direct?q=' + selectedCity + '&limit=1&appid=' + apiKey;

    fetch(apiURL).then(function (response) {
        if (response.ok) {
            response.json()
            .then(function (data) {
                selectedCityLatitude = data[0].lat;
                selectedCityLongitude = data[0].lon;
                getTodaysWeather();
                getWeatherForecast();
            });
        
        // change to error page
        } else {
            alert('Error: ' + response.statusText);
        }
    });
};

/* ===DISPLAY=== */

// Show dates using moment.js


// Show today's weather for selected city
function getTodaysWeather() {
    var apiURL = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + selectedCityLatitude + '&lon=' + selectedCityLongitude + '&exclude=minutely,hourly,daily,alerts&appid=' + apiKey +'&units=metric';

    fetch(apiURL).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
                var timeOffsetMinutes = (data.timezone_offset)/3600;
                currentTimeSelectedCity = time.utcOffset(timeOffsetMinutes).format('h:mA, D/M/YY');
                temperature = data.current.temp;
                wind = data.current.wind_speed;
                humidity = data.current.humidity;
                uv = data.current.uvi;
                showTodaysWeather();
            });
        } else {
            alert('Error: ' + response.statusText);
        }
    });
};

function showTodaysWeather() {
    selectedCityNameEl.text(selectedCity);
    dateTodayEl.text(currentTimeSelectedCity);
    temperatureTodayEl.text(temperature);
    windTodayEl.text(wind);
    humidityTodayEl.text(humidity);
    uvTodayEl.text(uv);
}

function getWeatherForecast() {

}

// Show weather forecast for selected city
function showWeatherForecast () {

}

// Set display of UV element based on value of UV index 


/* ===STORAGE=== */

// Save city in local storage 


// Display city in search history 



// When clicked, set clicked city as selected city and show weather data
