const API_KEY = api_keys.WEATH_API_KEY

//const API_KEY = "6b6a81bcad43c1c2eb4e6e5d0c874e35";

function onGeoOK(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log(latitude);
    console.log(longitude);
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
    console.log(url);
    fetch(url)
    .then(response => response.json())
    .then(data => {
        const weatherContainer = document.querySelector("#weather span:first-child");
        const cityContainer = document.querySelector("#weather span:last-child");
        cityContainer.innerText = data.name;
        weatherContainer.innerText = `${data.weather[0].main} | ${data.main.temp} ℃`;
    })
}


function onGeoError() {
    alert("Can't find you. No weather for you")

}

navigator.geolocation.getCurrentPosition(onGeoOK, onGeoError);