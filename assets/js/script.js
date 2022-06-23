/* JS DIRECTORY
    1. =VARIABLES
    2. =INPUT
    3. =DISPLAY-TODAY
    4. =DISPLAY-FORECAST
    5. =STORAGE
*/

/* ===VARIABLES=== */

// Search section element variables
var cityInputEl = document.getElementById('city-input');
var searchButtonEl = document.getElementById('search-button');
var searchHistoryEl = document.getElementById('search-history');
var clearButtonEl = document.getElementById('clear-button');

// Selected city variables
var selectedCity;
var selectedCityCountry;
var selectedCityLatitude;
var selectedCityLongitude;
var selectedCityOffsetHours;

// Selected city section element variables
var selectedCityNameEl = document.getElementById('selected-city-name');
var selectedCityCountryEl = document.getElementById('selected-city-country');

// Today's forecast section elements
var dateTodayEl = document.getElementById('date-today');
var temperatureTodayEl = document.getElementById('temperature-today');
var windTodayEl = document.getElementById('wind-today');
var humidityTodayEl = document.getElementById('humidity-today');
var uvTodayEl = document.getElementById('UV-today');
var iconTodayEl = document.getElementById('icon-today');

// Weather forecast section elements
var dateEls = document.querySelectorAll('.forecast-date');
var temperatureForecastEls = document.querySelectorAll('.temperature-forecast');
var windForecastEls = document.querySelectorAll('.wind-forecast');
var humidityForecastEls = document.querySelectorAll('.humidity-forecast');
var iconEls = document.querySelectorAll('.icon');

// API access
var apiKey = "88752a63ac29da05bb412d9600126dcf";


/* ===INPUT=== */

// When search button is clicked, set user's input as selected city
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

searchButtonEl.addEventListener('click', selectCity);

// Get latitude and longitude of selected city
function getLatLon(selectedCity) {
    var apiURL = 'https://api.openweathermap.org/geo/1.0/direct?q=' + selectedCity + '&limit=1&appid=' + apiKey;

    fetch(apiURL).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                selectedCityLatitude = data[0].lat;
                selectedCityLongitude = data[0].lon;
                selectedCityCountry = data[0].country;
                getTodaysWeatherData();
            });
        } else {
            alert('Error: ' + response.statusText);
        }
    });
}

/* ===DISPLAY-TODAY=== */

// Get data for today's weather in selected city
function getTodaysWeatherData() {
    var apiURL = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + selectedCityLatitude + '&lon=' + selectedCityLongitude + '&exclude=minutely,hourly,daily,alerts&appid=' + apiKey +'&units=metric';

    fetch(apiURL).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                showTodaysWeather(data);
                getWeatherForecastData();
            });
        } else {
            alert('Error: ' + response.statusText);
        }
    });
}

// Show today's weather in selected city
function showTodaysWeather(data) {    
    selectedCityNameEl.textContent = selectedCity;
    selectedCityCountryEl.textContent = selectedCityCountry;

    selectedCityOffsetHours = (data.timezone_offset)/3600;
    var currentTimeSelectedCity = moment().utcOffset(selectedCityOffsetHours).format('h:mmA, D/M/YY');
    dateTodayEl.textContent = currentTimeSelectedCity;

    temperatureTodayEl.textContent = data.current.temp;
    windTodayEl.textContent = data.current.wind_speed;
    humidityTodayEl.textContent = data.current.humidity;
    uvTodayEl.textContent = data.current.uvi;

    setUVColour(data);
    setWeatherIconToday(data);

    cityInputEl.value = '';
}

// Set display of UV element based on value of UV index 
function setUVColour(data) {
    var uvToday = data.current.uvi;
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

// Set display of weather icon based on weather data 
function setWeatherIconToday(data) {
    var weatherIconToday = data.current.weather[0].icon;
    var iconSourceURL = 'https://openweathermap.org/img/wn/' + weatherIconToday + '@2x.png';
    iconTodayEl.setAttribute('src', iconSourceURL);
}


/* ===DISPLAY-FORECAST=== */

// Get data for weather forecast in selected city
function getWeatherForecastData() {
    var apiURL = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + selectedCityLatitude + '&lon=' + selectedCityLongitude + '&exclude=current,minutely,hourly,alerts&appid=' + apiKey +'&units=metric';

    fetch(apiURL).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
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
        var forecastDate = moment().utcOffset(selectedCityOffsetHours).add(forecastOffset, 'days').format('D/M/YY');

        dateEls[i].textContent = forecastDate;
        temperatureForecastEls[i].textContent = data.daily[i].temp.day;
        windForecastEls[i].textContent = data.daily[i].humidity;
        humidityForecastEls[i].textContent = data.daily[i].wind_speed;

        var weatherIconToday = data.daily[i].weather[0].icon;
        var iconSourceURL = 'https://openweathermap.org/img/wn/' + weatherIconToday + '@2x.png';
        iconEls[i].setAttribute('src', iconSourceURL);
    }   
}

/* ===STORAGE=== */

// Save city in local storage 
function saveCity(selectedCity) {
    var savedCities = JSON.parse(localStorage.getItem("savedCities"));

    if (savedCities === null) {
        savedCities = [selectedCity];
    } else {
        savedCities.push(selectedCity);
    }

    localStorage.setItem("savedCities", JSON.stringify(savedCities));
    showCityHistory();
}

// Display city in search history 
function showCityHistory() {
    searchHistoryEl.innerHTML = '';
    
    var savedCities = JSON.parse(localStorage.getItem("savedCities"));
    
    if (savedCities !== null) {
        for (var i = 0; i < savedCities.length; i++) {
            var city = savedCities[i];
            var li = document.createElement("li");
            li.classList = 'btn btn-light btn-lg btn-block';
            li.textContent = city;
            searchHistoryEl.appendChild(li);
        }
    }
}

// When clicked, set clicked city as selected city and show weather data
searchHistoryEl.addEventListener('click', function(event) {
    selectedCity = event.target.innerHTML;
    getLatLon(selectedCity);
})

// When clear button is clicked, clear search history
clearButtonEl.addEventListener('click', function() {
    searchHistoryEl.innerHTML = '';
    localStorage.clear();
})

// When page loads, load search history and autopopulate with data for Sydney
window.onload = function() {
    selectedCity = 'Sydney'
    selectedCityState = 'AU'
    getLatLon('Sydney');

    showCityHistory();
}