(function() {
  var DARKSKY_API_URL = 'https://api.darksky.net/forecast/';
  var DARKSKY_API_KEY = '909a03baced3035eb51d7c806f00ba53';
  var CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

  var GOOGLE_MAPS_API_KEY = 'AIzaSyDlvobAu8R5OBGi26uhlE1pCidBAcp_eF0';
  var GOOGLE_MAPS_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
  

  function getCurrentWeather(coords) {
    var url = `${CORS_PROXY}${DARKSKY_API_URL}${DARKSKY_API_KEY}/${coords.lat},${coords.lng}?units=si&exclude=minutely,hourly,daily,alerts,flags`;
    
    return $.getJSON(url)
            .then(function(data) {
                return data.currently;
            })

  }
  
  function getCoordinatesForCity(cityName) {
      var url = `${GOOGLE_MAPS_API_URL}?address=${cityName}&key=${GOOGLE_MAPS_API_KEY}`;
  
      return $.getJSON(url)
            .then(function(data) {
                return data.results[0].geometry.location;
            })
  }
  
  var app = $('#app');
  var cityForm = app.find('.city-form');
  var cityInput = cityForm.find('.city-input');
  var cityWeather = app.find('.city-weather');
  
  cityForm.on('submit', function(event) {
    console.log("ihasdf")
      event.preventDefault();
      
      var city = cityInput.val();
      
      getCoordinatesForCity(city)
        .then(getCurrentWeather)
        .then(function(weather) {
          console.log('ahsdifh')
            cityWeather.text('Current temperature: ' + weather.temperature);
        });
  });
})()