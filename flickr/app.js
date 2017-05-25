(function() {
  var FLICKR_API_KEY = '0c84f02b3d6a8b4ea170c26e6ad3a828';
  var FLICKR_API_SECRET = 'ab318b5c7cb2c5c8';
  var FLICKR_API_URL = 'https://api.flickr.com/services/rest/';
  var page = 1;
  var amILoading = false;
  var lastSearchTerm = '';
  var app = document.querySelector('#app');
  var searchForm = app.querySelector('.search-form');
  var searchInput = searchForm.querySelector('.search-input');
  var photoResults = app.querySelector('.photo-results');
  
  function getPhotoForSearch(photoType) {
    
    var url = `${FLICKR_API_URL}?method=flickr.photos.search&format=json&nojsoncallback=1&api_key=${FLICKR_API_KEY}&text=${photoType}&page=${page}`;
    return (
        fetch(url)
        .then(response => {
          page++;
          return response.json();
        })
        .then(data => {
          var photos = data.photos.photo;
          return photos.map(function(photo){
              return {
                thumb: `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_q.jpg`, 
                large: `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`,
                title: photo.title,
              };
          });
        })
      );
  }
  var last_known_scroll_position = 0;
  var ticking = false;
  
  function infiniScroll(scroll_pos) {
    // do something with the scroll position
    if (!amILoading && (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100){
      amILoading = true;
      getPhotoForSearch(lastSearchTerm)
      .then(results =>{
          results.map(createFlickrThumb)
          .forEach(imgElement => {
            photoResults.appendChild(imgElement);
          });
          setTimeout(function(){ amILoading = false; }, 2000); //prevent loading of multiple sets of images
      });
    }
  }
  
  window.addEventListener('scroll', function(e) {
    last_known_scroll_position = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(function() {
        infiniScroll(last_known_scroll_position);
        ticking = false;
      });
    }
    ticking = true;
  });
  
  function createFlickrThumb(photoData) {
    
    var link = document.createElement('a');
    link.setAttribute('class', 'link');
    link.setAttribute('href', photoData.large);
    link.setAttribute('target', '_blank');
  
    var image = document.createElement('img');
    image.setAttribute('class', 'image');
    image.setAttribute('src', photoData.thumb);
    image.setAttribute('alt', photoData.title);
  
    link.appendChild(image);
    
    return link;
  }
  
  searchForm.addEventListener('submit', function(event) {
      event.preventDefault();
      console.log(photoResults.firstChild);
      var picture = searchInput.value;
      lastSearchTerm = picture;
      
      while (photoResults.firstChild) {
        photoResults.removeChild(photoResults.firstChild);
      }
      photoResults.innerText = 'Loading...';
      console.log(photoResults);
      getPhotoForSearch(picture)
      .then(results => {
        photoResults.removeChild(photoResults.lastChild);
        console.log(photoResults);
        results.map(createFlickrThumb)
        .forEach(imgElement => {
          photoResults.appendChild(imgElement);
        });
      });
    searchInput.value = '';
  });
})();