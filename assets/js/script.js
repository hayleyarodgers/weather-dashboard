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

var currentTimeSelectedCity;
var timeOffsetHours;

var icon;
var temperature;
var wind;
var humidity;
var uv;

var dateTodayEl = document.getElementById('date-today');
var temperatureTodayEl = document.getElementById('temperature-today');
var windTodayEl = document.getElementById('wind-today');
var humidityTodayEl = document.getElementById('humidity-today');
var uvTodayEl = document.getElementById('UV-today');

var iconEls = document.querySelectorAll('.icon');

var date1El = document.getElementById('today+1');
var date2El = document.getElementById('today+2');
var date3El = document.getElementById('today+3');
var date4El = document.getElementById('today+4');
var date5El = document.getElementById('today+5');
var dateEls = [date1El, date2El, date3El, date4El, date5El];


var temperature1El = document.getElementById('temperature-1');
var temperature2El = document.getElementById('temperature-2');
var temperature3El = document.getElementById('temperature-3');
var temperature4El = document.getElementById('temperature-4');
var temperature5El = document.getElementById('temperature-5');
var temperatureForecastEls = [temperature1El, temperature2El, temperature3El, temperature4El, temperature5El];

var wind1El = document.getElementById('wind-1');
var wind2El = document.getElementById('wind-2');
var wind3El = document.getElementById('wind-3');
var wind4El = document.getElementById('wind-4');
var wind5El = document.getElementById('wind-5');
var windForecastEls = [wind1El, wind2El, wind3El, wind4El, wind5El];

var humidity1El = document.getElementById('humidity-1');
var humidity2El = document.getElementById('humidity-2');
var humidity3El = document.getElementById('humidity-3');
var humidity4El = document.getElementById('humidity-4');
var humidity5El = document.getElementById('humidity-5');
var humidityForecastEls = [humidity1El, humidity2El, humidity3El, humidity4El, humidity5El];

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

    selectedCity = cityInputEl.value;

    // change to pop-up
    if (!selectedCity) {
        alert('You need to select a city!');
        return;
    }

    cityInputEl.value = '';

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
            });
        
        // change to error page
        } else {
            alert('Error: ' + response.statusText);
        }
    });
};

/* ===DISPLAY=== */

// Show today's weather for selected city
function getTodaysWeather() {
    var apiURL = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + selectedCityLatitude + '&lon=' + selectedCityLongitude + '&exclude=minutely,hourly,daily,alerts&appid=' + apiKey +'&units=metric';

    fetch(apiURL).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                timeOffsetHours = (data.timezone_offset)/3600;
                currentTimeSelectedCity = moment().utcOffset(timeOffsetHours).format('h:mmA, D/M/YY');
                temperature = data.current.temp;
                wind = data.current.wind_speed;
                humidity = data.current.humidity;
                uv = data.current.uvi;
                showTodaysWeather();
                getWeatherForecast();
            });
        } else {
            alert('Error: ' + response.statusText);
        }
    });
};

function showTodaysWeather() {
    selectedCityNameEl.textContent = selectedCity;
    dateTodayEl.textContent = currentTimeSelectedCity;
    temperatureTodayEl.textContent = temperature;
    windTodayEl.textContent = wind;
    humidityTodayEl.textContent = humidity;
    uvTodayEl.textContent = uv;
}

console.log(temperatureForecastEls)

function getWeatherForecast() {
        var apiURL = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + selectedCityLatitude + '&lon=' + selectedCityLongitude + '&exclude=current,minutely,hourly,alerts&appid=' + apiKey +'&units=metric';

        fetch(apiURL).then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    showWeatherForecastDates();
                    console.log(data);
                    data.daily[i]
                });
            } else {
               alert('Error: ' + response.statusText);
           }
        });
   }

function showWeatherForecastDates() {
    for (var i = 0; i < dateEls.length; i++) {
        var forecastOffset = parseInt([i]) + 1;    
        var forecastDate = moment().utcOffset(timeOffsetHours).add(forecastOffset, 'days').format('D/M/YY');        
        dateEls[i].textContent = forecastDate;
    }   
}


// Show weather forecast for selected city
function showWeatherForecast () {

}

// Set display of UV element based on value of UV index 


/* ===STORAGE=== */

// Save city in local storage 


// Display city in search history 



// When clicked, set clicked city as selected city and show weather data