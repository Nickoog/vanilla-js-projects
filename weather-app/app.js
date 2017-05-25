(function() {
  var DARKSKY_API_URL = 'https://api.darksky.net/forecast/';
  var DARKSKY_API_KEY = '909a03baced3035eb51d7c806f00ba53';
  var CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

  var GOOGLE_MAPS_API_KEY = 'AIzaSyDlvobAu8R5OBGi26uhlE1pCidBAcp_eF0';
  var GOOGLE_MAPS_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
  
  var defaultBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(-90,-180),
    new google.maps.LatLng(90,180));

  var options = {
    bounds: defaultBounds,
    types: ['(regions)']
  };
  

  function getCurrentWeather(coords) {
    var url = `${CORS_PROXY}${DARKSKY_API_URL}${DARKSKY_API_KEY}/${coords.lat},${coords.lng}?units=si&exclude=minutely,hourly,daily,alerts,flags`;

    return (
      fetch(url)
      .then(response => response.json())
      .then(data => data.currently)
    );
  }

  function getCoordinatesForCity(cityName) {
    var url = `${GOOGLE_MAPS_API_URL}?address=${cityName}&key=${GOOGLE_MAPS_API_KEY}`;

    return (
      fetch(url)
      .then(response => response.json())
      .then(data => data.results[0].geometry.location)
    );
  }
  
  function getDailyData(coords) {
        var url = `${CORS_PROXY}${DARKSKY_API_URL}${DARKSKY_API_KEY}/${coords.lat},${coords.lng}?units=si&exclude=currently,minutely,hourly,alerts,flags`;
        
        return (
            fetch(url)
            .then(response => response.json())
            .then(data => data.daily.data)
        );
    }
    // getCoordinatesForCity("toronto").then(console.log);
    // getCurrentWeather({lat: 45.5, lng: -73.5}).then(console.log);
    // getDailyData({lat: 45.5, lng: -73.5}).then(console.log);
  
  function getIcons(icon) {
    if(icon === 'clear-day') {
      return 'https://maxcdn.icons8.com/iOS7/PNG/100/Weather/sun-100.png';
    } else if (icon == 'clear-night') {
      return 'https://maxcdn.icons8.com/iOS7/PNG/100/Weather/bright_moon-100.png';
    } else if (icon == 'rain') {
      return 'https://maxcdn.icons8.com/iOS7/PNG/100/Weather/rain-100.png';
    } else if (icon == 'snow') {
      return 'https://maxcdn.icons8.com/iOS7/PNG/100/Weather/snow-100.png';
    } else if (icon == 'sleet') {
      return 'https://maxcdn.icons8.com/iOS7/PNG/100/Weather/sleet-100.png';
    } else if (icon == 'wind'){
      return 'https://maxcdn.icons8.com/iOS7/PNG/100/Weather/windy_weather-100.png';
    } else if (icon == 'fog') {
      return 'https://maxcdn.icons8.com/iOS7/PNG/100/Weather/fog_day-100.png';
    } else if (icon == 'cloudy') {
      return 'https://maxcdn.icons8.com/iOS7/PNG/100/Network/shared-100.png';
    } else if (icon == 'partly-cloudy-day') {
      return 'https://maxcdn.icons8.com/iOS7/PNG/100/Weather/partly_cloudy_day-100.png';
    } else if (icon == 'partly-cloudy-night') {
      return 'https://maxcdn.icons8.com/iOS7/PNG/100/Weather/partly_cloudy_night-100.png';
    } else {
      return 'https://i.imgur.com/YMaxYVX.png';
    }
  }
  
  var app = document.querySelector('#app');
  var cityForm = app.querySelector('.city-form');
  var cityInput = cityForm.querySelector('.city-input');
  var cityWeather = app.querySelector('.city-weather');
  var weekdays = ["- Sunday -","- Monday -","- Tuesday -","- Wednesday -","- Thursday -","- Friday -","- Saturday -"];
  
  autocomplete = new google.maps.places.Autocomplete(cityInput, options);

  cityForm.addEventListener('submit', function(event) {
    event.preventDefault(); // prevent the form from submitting
    
    var city = cityInput.value;
    cityWeather.innerHTML = '';
    
    var currentWeather = document.createElement('div');
    cityWeather.appendChild(currentWeather);
    currentWeather.setAttribute('class', 'currentWeather');
    currentWeather.innerText = 'Loading...';
    
    getCoordinatesForCity(city)
    .then(getCurrentWeather)
    .then(function(weather) {
      
      currentWeather.innerText = '';
      
      // create elements for weather icon
      
      var currentWeatherIcon = document.createElement('div');
      currentWeather.appendChild(currentWeatherIcon);
      currentWeatherIcon.setAttribute('class', 'currentWeather_icon');
      
      var skyconsIcon = document.createElement('canvas');
      currentWeather.appendChild(skyconsIcon);
      skyconsIcon.setAttribute('id', weather.icon);
      
      //create elements for weather informations(temperature, summary, wind, humidity)
      
      var currentWeatherInfo = document.createElement('div');
      currentWeather.appendChild(currentWeatherInfo);
      currentWeatherInfo.setAttribute('class', 'currentWeather_info');
      // Temperature
      var currentTemp = document.createElement('p');
      currentWeatherInfo.appendChild(currentTemp);
      currentTemp.setAttribute('class', 'currentWeather_temp');
      currentTemp.innerText = `Temperature at ${city} : ${Math.round(weather.temperature)} °C`;
      //Summary
      var currentSummary = document.createElement('p');
      currentWeatherInfo.appendChild(currentSummary);
      currentSummary.setAttribute('class', 'weather-info');
      currentSummary.innerText = weather.summary;
      //Wind
      var currentWind = document.createElement('p');
      currentWeatherInfo.appendChild(currentWind);
      currentWind.setAttribute('class', 'currentWeather_wind');
      currentWind.innerText = `Wind speed: ${Math.round(weather.windSpeed)} Km/h`;
      //Humidity
      var currentHumidity = document.createElement('p');
      currentWeatherInfo.appendChild(currentHumidity);
      currentHumidity.setAttribute('class', 'currentWeather_humidity');
      currentHumidity.innerText = `Humidity: ${Math.round(weather.humidity*100)} %`;
      
      //Create next week forecast;
      
      var forecast = document.createElement('div');
      cityWeather.appendChild(forecast);
      forecast.setAttribute('class', 'forecast');
      forecast.innerHTML = 'Loading...';
      
      getCoordinatesForCity(city)
      .then(getDailyData)
      .then(dailyData => {
        forecast.innerHTML = '';
      
        var today = (new Date()).getDay(); // JavaScript function get number for each weekday (ex: sunday=0)
        var days = ["- Today -", "- Tomorrow -", weekdays[(today+2)%7], weekdays[(today+3)%7], weekdays[(today+4)%7], weekdays[(today+5)%7]]; 
        
        var row = document.createElement('div');
        forecast.appendChild(row);
        row.setAttribute('class', 'row');
        
        // create loop for display weekday and informations 
        for (var i = 0; i < 6; i++) {
          
          var col = document.createElement('div');
          row.appendChild(col);
          col.setAttribute('class', 'col-small-12 col-medium-6 col-large-4');
          
          var oneDay = document.createElement('div');
          col.appendChild(oneDay);
          oneDay.setAttribute('class', 'one-day');
          
          var title = document.createElement('h3');
          oneDay.appendChild(title);
          title.setAttribute('class', 'oneDay-title');
          title.innerText = days[i];
          //Icons
          var oneDayIcon = document.createElement('img');
          oneDay.appendChild(oneDayIcon);
          oneDayIcon.setAttribute('class', 'oneDay-img');
          oneDayIcon.setAttribute('alt', dailyData[i].icon);
          oneDayIcon.setAttribute('src', getIcons(dailyData[i].icon));
          //Temperature max
          var maxTemp = document.createElement('p');
          maxTemp.setAttribute('class', 'oneDay-info');
          oneDay.appendChild(maxTemp);
          maxTemp.innerHTML = `Max: ${Math.round(dailyData[i].temperatureMax)}°C`;
          //Temperature min
          var minTemp = document.createElement('p');
          oneDay.appendChild(minTemp);
          minTemp.setAttribute('class', 'oneDay-info');
          minTemp.innerHTML = `Min: ${Math.round(dailyData[i].temperatureMin)}°C`;
          //Summary
          var summary = document.createElement('p');
          oneDay.appendChild(summary);
          summary.setAttribute('class', 'oneDay-info');
          summary.innerHTML = dailyData[i].summary;
        }
      });
      
        var icons = new Skycons({"color": "black"});
  
        icons.set("clear-day", Skycons.CLEAR_DAY);
        icons.set("clear-night", Skycons.CLEAR_NIGHT);
        icons.set("partly-cloudy-day", Skycons.PARTLY_CLOUDY_DAY);
        icons.set("partly-cloudy-night", Skycons.PARTLY_CLOUDY_NIGHT);
        icons.set("cloudy", Skycons.CLOUDY);
        icons.set("rain", Skycons.RAIN);
        icons.set("sleet", Skycons.SLEET);
        icons.set("snow", Skycons.SNOW);
        icons.set("wind", Skycons.WIND);
        icons.set("fog", Skycons.FOG);
        
        icons.play();
        
      // var icons = new Skycons({"color":"white"}),
      //   list = [
      //     "clear-day",
      //     "clear-night",
      //     "partly-cloudy-day",
      //     "partly-cloudy-night",
      //     "cloudy",
      //     "rain",
      //     "sleet",
      //     "snow",
      //     "wind",
      //     "fog"
      //   ],
      //   i;
    
      //   for(i = list.length; i--; ) {
      //     var weatherType = list[i],
      //         elements = document.getElementsByClassName( weatherType );
      //           console.log(elements);
      //     for (e = elements.length; e--;){
      //         icons.set( elements[e], weatherType );
      //       }
      //   }

      // icons.play();
        
        cityInput.value = ''; // clean input;
    });
  });
  
})();

