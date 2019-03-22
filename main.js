
// Obtain reference to DOM elements
const description = document.querySelector('.description');
const summaryBox = document.querySelector('.summary');
const summary = document.querySelector('.summary p');
const temp = document.querySelector('.temp p');
const pressure = document.querySelector('.pressure p');
const humidity = document.querySelector('.humidity p');
const input = document.querySelector('.search input[type="text"]');
const form = document.querySelector('form');
const main = document.querySelector('main');

let imgObjectURL = null;

/**
 * Defining an event listener for form submit events.
 */
form.addEventListener('submit', function (e) {
    // Prevent default behaviour of browser for submit event (ie: reloading page etc.)
    e.preventDefault();

    if (input.value) {
        let city = input.value.toLowerCase().trim();
        // Use fetch api to obtain weather data
        getWeatherData(city);
    }
    // clears search field to prepare for next input
    input.value = "";
})

/**
 *  Uses Fetch API to fetch weather data for selected city and display it.
 */
function getWeatherData(city) {

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=10332be5fad5e50350cb94437f8f1b41`)
        .then(function (response) {
            // returns response as structured json data
            return response.json();
        })
        .then(function (jsonData) {
            // Update the weather text and background image.
            if (jsonData.name.toLowerCase() === city) {
                generateWeatherInfo(jsonData);
                updateBackgroundImage(jsonData.weather[0].main);
            }
        }).catch(function (error) {
            console.log('Error: ' + error)
            summary.textContent = `Sorry! Weather data is currenty unavailable.`;
            description.style.opacity = 0;
            summaryBox.style.opacity = 1;
        });
}


/**
 * Uses Fetch API to fetcch background image and render it
 */
function updateBackgroundImage(weatherType) {
    // informs browser to release existing reference to image object url of previously fetched image.
    if (imgObjectURL) {
        URL.revokeObjectURL(imgObjectURL);
    }

    fetch(`https://source.unsplash.com/1600x900/?sky,${weatherType}`).then(function (response) {
        // checks if HTTP response is OK (ie: 200-299 range)
        if (response.ok) {
            // returns response as a blob 
            return response.blob();
        }

        // If response is not OK throw an error.
        throw new Error('Network response was not OK');

    }).then(function (imgBlob) {
        // converting blob to an object URL (a temporary internal URL which points to our image blob object stored inside the browser)
        imgObjectURL = URL.createObjectURL(imgBlob);
        // setting the new background image on CSS 'background-image' property
        main.style.backgroundImage = `url(${imgObjectURL})`;
    }).catch(function (error) {
        console.log('Fetch operation failed:', error);
    })
}

// A function which updates the DOM content
function generateWeatherInfo(weatherData) {
    // Enable the visibility of the weather information
    description.style.opacity = 1;
    summaryBox.style.opacity = 1;
    // update the weather information
    summary.textContent = `The weather forecast for ${weatherData.name} is ${weatherData.weather[0].description}`;
    temp.textContent = `Temperature: ${weatherData.main.temp.toPrecision(2)} °C / ${celciusToFahrenheit(weatherData.main.temp)} °F`;
    pressure.textContent = `Pressure: ${weatherData.main.pressure} hPa`;
    humidity.textContent = `Humidity: ${weatherData.main.humidity} %`;
}

// A function to convert temperature in Celcius(°C) to Fahrenheit (°F)
function celciusToFahrenheit(celcius) {
    return (celcius * 9 / 5 + 32).toPrecision(2);
}