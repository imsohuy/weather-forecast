// select element
const notificationElement = document.querySelector(".notification");
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");

// App data
const weather = {};

weather.temperature = {
    unit : "celsius"
}
// app constants and vars
const KELVIN = 273; // for temperature values
// api key
const key = "95c12e4a1f0367e26721c338c7952a77"

// check if browser supports geolocation
if ('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(setPosition,showError);
} else {
    notificationElement.style.display="block";
    notificationElement.innerHTML = "<p>Browser doesn't support Geolocation.</p>";
}

// set user's position
function setPosition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    getWeather(latitude,longitude);
}

// show error when there is an issue w/ the geolocation service
function showError(showError){
    notificationElement.style.display="block";
    notificationElement.innerHTML = `<p>${showError.message}</p>`;
}
function getWeather(latitude, longitude){
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
    fetch(api)
    .then(function (response){
        let data = response.json();
        return data;
    })
    .then(function (data){
        weather.temperature.value=Math.floor(data.main.temp-KELVIN);
        weather.description = data.weather[0].description;
        weather.iconId = data.weather[0].icon;
        weather.city = data.name;
        weather.country = data.sys.country;
    })
    .then(function (){
        displayWeather();
    })
}

// display weather to ui
function displayWeather(){
    iconElement.innerHTML =`<img src="icons/${weather.iconId}.png"/>`;
    tempElement.innerHTML =`${weather.temperature.value}°<span>C</span>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city},${weather.country}`;
}

// C to F conversion
function celsiusToFahrenheit(temperature) {
    return (temperature * 9/5) + 32;
}

// when the user clicks on the temperature element
tempElement.addEventListener("click",function(){
    if (weather.temperature.value == undefined) return;
    
    if (weather.temperature.unit == "celsius"){
        let fahrenheit =celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);

        tempElement.innerHTML = `${weather.temperature.value}°<span>F</span>`;
        weather.temperature.unit = "fahrenheit";
    } else {
        tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        weather.temperature.unit = "celsius";
    }
})