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
var selectedCityCountryEl = document.getElementById('selected-city-country');
var selectedCity;
var selectedCityCountry;
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

var savedCities;

/* ===INPUT=== */

// When search button is clicked, set user's input as selected city
searchButtonEl.addEventListener('click', selectCity);

function selectCity(event) {
    event.preventDefault();
    selectedCity = cityInputEl.value;

    if (!selectedCity) {
        alert('You need to select a city!');
        return;
    }

    getLatLon(selectedCity);
    saveCity(selectedCity);
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
                selectedCityCountry = data[0].country;
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
    selectedCityCountryEl.textContent = selectedCityCountry;
    dateTodayEl.textContent = currentTimeSelectedCity;
    temperatureTodayEl.textContent = data.current.temp;
    windTodayEl.textContent = data.current.wind_speed;
    humidityTodayEl.textContent = data.current.humidity;
    uvTodayEl.textContent = data.current.uvi;
    cityInputEl.value = '';

    var uvToday = data.current.uvi;
    setUVColour(uvToday);
}

// Set display of UV element based on value of UV index 
function setUVColour(uvToday) {
    uvTodayEl.classList = "btn btn-lg";

    if (uvToday <= 2) {
        uvTodayEl.classList.add('greenUV');
    } else if (2 < uvToday <= 5) {
        uvTodayEl.classList.add('yellowUV');
    } else if (6 < uvToday <= 7) {
        uvTodayEl.classList.add('orangeUV');
    } else if (8 < uvToday <= 10) {
        uvTodayEl.classList.add('redUV');
    } else if (uvToday >= 5) {
        uvTodayEl.classList.add('purpleUV');
    }
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

/* ===STORAGE=== */

// Save city in local storage 
function saveCity(selectedCity) {
    savedCities = JSON.parse(localStorage.getItem("savedCities"));

    if (savedCities === null) {
        savedCities = [selectedCity];
    } else {
        savedCities.push(selectedCity);
    }

    localStorage.setItem("savedCities", JSON.stringify(savedCities));
    showCityHistory(savedCities);
}

// Display city in search history 
function showCityHistory(savedCities) {
    searchHistoryEl.innerHTML = '';
    
    for (var i = 0; i < savedCities.length; i++) {
        var city = savedCities[i];
        var li = document.createElement("li");
        li.classList = 'btn btn-light btn-lg btn-block';
        li.textContent = city;
        searchHistoryEl.appendChild(li);
    }
}

// When clicked, set clicked city as selected city and show weather data
function showWeatherForSavedCity(event) {
    selectedCity = event.target.innerHTML;
    getLatLon(selectedCity);
}

searchHistoryEl.addEventListener('click', showWeatherForSavedCity);

// Autopopulate with data for Sydney when the page loads
window.onload = function() {
    selectedCity = 'Sydney'
    selectedCityState = 'New South Wales'
    getLatLon('Sydney');
}