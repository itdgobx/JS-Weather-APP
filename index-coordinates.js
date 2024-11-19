const apikey = "";
const weatherDataEl = document.getElementById("weather-data");
const cityInputEl = document.getElementById("city-input");
const formEl = document.querySelector("form");

// function for getting the coordinates of the city
const getCoordinates = async (cityValue) => {
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityValue}&limit=1&appid=${apikey}`;
    try {
        const response = await fetch(geoUrl);
        if (!response.ok) {
            throw new Error("Failed to fetch coordinates");
        }
        const data = await response.json();
        if (data.length === 0) {
            throw new Error("City not found");
        }
        return { lat: data[0].lat, lon: data[0].lon }; // 返回经纬度
    } catch (error) {
        console.error("Error fetching coordinates:", error.message);
        throw error; // 抛出错误，供上层捕获
    }
};

// function for getting weather data
const getWeatherData = async (lat, lon) => {
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apikey}&units=metric`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("Weather data:", data);

        // 提取并更新天气信息（保持不变）
        const temperature = Math.round(data.current.temp); // 注意：OneCall API 使用 `current.temp`
        const description = data.current.weather[0].description;
        const icon = data.current.weather[0].icon;
        const details = [
            `Feels like: ${Math.round(data.current.feels_like)}°C`,
            `Humidity: ${data.current.humidity}%`,
            `Wind Speed: ${data.current.wind_speed}m/s`,
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
            .join("");
    } catch (error) {
        console.error("Error fetching weather data:", error.message);
    }
};

// In the form listener, get the coordinates first, then use them to get the weather data
formEl.addEventListener("submit", async (event) => {
    event.preventDefault();
    const cityValue = cityInputEl.value.trim();
    if (!cityValue) {
        console.error("City name is required");
        return;
    }

    try {
        // 获取经纬度
        const { lat, lon } = await getCoordinates(cityValue);
        console.log(`Coordinates for ${cityValue}: lat=${lat}, lon=${lon}`);

        // 使用经纬度获取天气数据
        await getWeatherData(lat, lon);
    } catch (error) {
        console.error("Error:", error.message);
    }
});
