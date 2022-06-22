/* JS DIRECTORY
    1. =VARIABLES
    2. =INPUT
    3. =DISPLAY
    4. =STORAGE
*/

/* ===VARIABLES=== */

// Section element variables
var cityInputEl = document.getElementById('city-input');
var searchButtonEl = document.getElementById('search-button');
var searchHistoryEl = document.getElementById('search-history');

var selectedCityNameEl = document.getElementById('selected-city-name');
var selectedCity;
var selectedCityLatitude;
var selectedCityLongitude;

var offsetHoursSelectedCity;

var dateTodayEl = document.getElementById('date-today');
var temperatureTodayEl = document.getElementById('temperature-today');
var windTodayEl = document.getElementById('wind-today');
var humidityTodayEl = document.getElementById('humidity-today');
var uvTodayEl = document.getElementById('UV-today');

var iconEls = document.querySelectorAll('.icon');

var dateEls = document.querySelectorAll('.forecast-date');
var temperatureForecastEls = document.querySelectorAll('.temperature-forecast');
var windForecastEls = document.querySelectorAll('.wind-forecast');
var humidityForecastEls = document.querySelectorAll('.humidity-forecast');

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
searchButtonEl.addEventListener('click', selectCity);

function selectCity(event) {
    event.preventDefault();

    selectedCity = cityInputEl.value.trim();

    if (!selectedCity) {
        alert('You need to select a city!');
        return;
    }

    cityInputEl.value = '';

    getLatLon();
}

// Get latitude and longitude of selected city
function getLatLon(selectedCity) {
    var apiURL = 'http://api.openweathermap.org/geo/1.0/direct?q=' + selectedCity + '&limit=1&appid=' + apiKey;

    fetch(apiURL).then(function (response) {
        if (response.ok) {
            response.json()
            .then(function (data) {
                selectedCityLatitude = data[0].lat;
                selectedCityLongitude = data[0].lon;
                getTodaysWeatherData();
            });
        } else {
            alert('Error: ' + response.statusText);
        }
    });
};

/* ===DISPLAY=== */

// Get data for today's weather in selected city
function getTodaysWeatherData() {
    var apiURL = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + selectedCityLatitude + '&lon=' + selectedCityLongitude + '&exclude=minutely,hourly,daily,alerts&appid=' + apiKey +'&units=metric';

    fetch(apiURL).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                showTodaysWeather(data);
                getWeatherForecastData();
            });
        } else {
            alert('Error: ' + response.statusText);
        }
    });
};

// Show today's weather in selected city
function showTodaysWeather(data) {
    offsetHoursSelectedCity = (data.timezone_offset)/3600;
    var currentTimeSelectedCity = moment().utcOffset(offsetHoursSelectedCity).format('h:mmA, D/M/YY');

    selectedCityNameEl.textContent = selectedCity;
    dateTodayEl.textContent = currentTimeSelectedCity;
    temperatureTodayEl.textContent = data.current.temp;
    windTodayEl.textContent = data.current.wind_speed;
    humidityTodayEl.textContent = data.current.humidity;
    uvTodayEl.textContent = data.current.uvi;
}

// Get data for weather forecast in selected city
function getWeatherForecastData() {
    var apiURL = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + selectedCityLatitude + '&lon=' + selectedCityLongitude + '&exclude=current,minutely,hourly,alerts&appid=' + apiKey +'&units=metric';

    fetch(apiURL).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                showWeatherForecast(data);
            });
        } else {
            alert('Error: ' + response.statusText);
        }
    });
}

// Show weather forecast in selected city
function showWeatherForecast(data) {
    for (var i = 0; i < dateEls.length; i++) {
        var forecastOffset = parseInt([i]) + 1;    
        var forecastDate = moment().utcOffset(offsetHoursSelectedCity).add(forecastOffset, 'days').format('D/M/YY');

        dateEls[i].textContent = forecastDate;
        temperatureForecastEls[i].textContent = data.daily[i].temp.day;
        windForecastEls[i].textContent = data.daily[i].humidity;
        humidityForecastEls[i].textContent = data.daily[i].wind_speed;
    }   
}

// Set display of UV element based on value of UV index 
function uvColour() {
    
}

/* ===STORAGE=== */

// Save city in local storage 


// Display city in search history 



// When clicked, set clicked city as selected city and show weather data


// Autopopulate with data for Sydney when the page loads
window.onload = function() {
    selectedCity = 'Sydney'
    getLatLon('Sydney');
}