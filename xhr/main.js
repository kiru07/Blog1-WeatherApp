// Obtain references to DOM elements
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
    // clear text field
    input.value = "";
})

/**
 *  Uses XMLHttpRequest to fetch weather data for selected city
 */
function getWeatherData(city) {
    let httpRequest = new XMLHttpRequest();

    if (!httpRequest) {
        console.log('Cannot create XHR instance');
        return false;
    }

    // Specifying an event handler for the 'readystatechange' events fired(for each state change) when response is received from the server.
    httpRequest.addEventListener('readystatechange', function () {
        try {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === 200) {

                    // Parse JSON string message received from weather api. Returns a json object.
                    let weatherData = JSON.parse(httpRequest.responseText);

                    // Update the weather information and background image
                    generateWeatherInfo(weatherData);
                    getBackgroundImage(weatherData.weather[0].main);

                } else {
                    console.log('There was a problem with the request');
                    summary.textContent = `Sorry! weather information unavailable.`;
                    description.style.opacity = 0;
                    summaryBox.style.opacity = 1;
                }
            }
        } catch (e) {
            console.log('Exception:' + e);
        }

    });

    httpRequest.open('GET', `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=YOUR-API-KEY`);
    httpRequest.send();
}


function getBackgroundImage(weatherType) {

    let httpRequest = new XMLHttpRequest();

    if (!httpRequest) {
        console.log('Cannot create XHR instance');
        return false;
    }

    // informs browser to release existing reference to image object url of previously fetched image.
    if (imgObjectURL) {
        URL.revokeObjectURL(imgObjectURL);
    }

    // Using modern 'load' event instead of 'readystatechange' (fired only when state is DONE(4))
    httpRequest.addEventListener('load', function () {
        try {
            if (httpRequest.status === 200) {
                let imgBlob = httpRequest.response;

                //convert blob to a object URL (a temporary internal URL which points to our image blob object stored inside the browser)
                imgObjectURL = URL.createObjectURL(imgBlob);
                // set the new background image
                main.style.backgroundImage = `url(${imgObjectURL})`;
            } else {
                console.log('There was a problem with the request');
            }
        } catch (e) {
            console.log('Exception: ' + e);
        }
    });

    httpRequest.open('GET', `https://source.unsplash.com/1600x900/?sky,${weatherType}`);
    httpRequest.responseType = 'blob';  // set response message type to blob.
    httpRequest.send();
}


// A function which updates the DOM content
function generateWeatherInfo(weatherData) {
    // Enabling the visibility of the weather information
    description.style.opacity = 1;
    summaryBox.style.opacity = 1;
    // updating the weather information
    summary.textContent = `The weather forecast for ${weatherData.name} is ${weatherData.weather[0].description}`;
    temp.textContent = `${weatherData.main.temp} °C / ${celciusToFahrenheit(weatherData.main.temp)} °F`;
    pressure.textContent = `Pressure: ${weatherData.main.pressure} hPa`;
    humidity.textContent = `Humidity: ${weatherData.main.humidity} %`;
}

// A function to convert temperature in Celcius(°C) to Fahrenheit (°F)
function celciusToFahrenheit(celcius) {
    return (celcius * 9 / 5 + 32).toPrecision(2);
}
