const apikey = "";
const weatherDataEl = document.getElementById("weather-data");
const cityInputEl = document.getElementById("city-input");
const formEl = document.querySelector("form");

const getWeatherData = async (cityValue) => {
    console.log("city", cityValue);
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityValue}&appid=${apikey}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw error("Network response was not ok");
        }
        const data = await response.json();
        console.log("data", data);
        const temperature = Math.round(data.main.temp);
        const description = data.weather[0].description;
        const icon = data.weather[0].icon;
        const details = [
            `Feels like: ${Math.round(data.main.feels_like)}`,
            `Humidity: ${data.main.humidity}%`,
            `Wind Speed: ${data.wind.speed}m/s`,
        ];
        weatherDataEl.querySelector(
            ".icon"
        ).innerHTML = `<img src='http://openweathermap.org/img/wn/${icon}.png' alt='weather icon' />`;
        weatherDataEl.querySelector(
            ".temperature"
        ).textContent = `${temperature}°C`;
        weatherDataEl.querySelector(".description").textContent = description;
        weatherDataEl.querySelector(".details").innerHTML = details
            .map((detail) => `<div>${detail}</div>`)
            .join(""); //map 方法返回的是一个new array，join方法将数组转换为字符串
    } catch (error) {
        console.error("Error:", error);
    }
};

formEl.addEventListener("submit", (event) => {
    event.preventDefault();
    const cityValue = cityInputEl.value;
    getWeatherData(cityValue);
});
