
// TODO
/* 
  languages
  darkmode
  news
  //searchInput -> dropdown when typing to search
  //contact
  error handling
  change between c,f and km,mile
*/
// ! global
const language      = 'en-EN',
      standardCity  = 'london',
      searchInput   = document.getElementById('searchInput'),
      weatherDiv    = document.getElementById('weather'),
      dayCount      = document.getElementById('dayCounts');

// ! Events
document.querySelectorAll('.menu .nav-link').forEach(function(link) {
  link.addEventListener('click',function() {
    document.querySelector('.menu .active').classList.remove('active');
    link.classList.add('active');
  })
});

getWeather(standardCity);

if(searchInput) {
  searchInput.addEventListener('input', function(e) {
    if (searchInput.value.replace(/\s/g, '').length > 2) {
      getSearchCity(searchInput.value);
      dayCount.value ? getWeather(searchInput.value,dayCount.value) : getWeather(searchInput.value);
    }
  })
}

if(dayCount) {
  dayCount.addEventListener('input', function() {
    if (dayCount.value > 3 && dayCount.value <= 14) {
      getWeather(searchInput.value, dayCount.value);
    } else {
      getWeather(searchInput.value);
    }
  })
}

// ! Functions

async function getWeather(city,dayCount = 3) {
  try {
    const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=95f2b8483544432a8f9213042231502&q=${city}&days=${dayCount}`);
    const data = await response.json();

    display(data.current,data.location,data.forecast.forecastday);
  } catch (error) {
    
  }
}

async function getSearchCity(text) {
  try {
    const response = await fetch(`https://api.weatherapi.com/v1/search.json?key=95f2b8483544432a8f9213042231502&q=${text}`);
    const data = await response.json();
    console.log(data)
    document.getElementById('cityname').innerHTML = '';
    data.forEach(city => {
      document.getElementById('cityname').innerHTML += `<option>${city.name + ', ' + city.country}</option>`;
    });
  } catch (error) {
    
  }
}

function display (current,location,forecast) {
  weatherDiv.innerHTML = '';
  let weatherHTML = '';
  // ? TODAY
  weatherHTML += `
  <div class="col-lg-4 p-0">
    <div class="card-l text-white h-100">
      <div class="card-top d-flex justify-content-between">
        <small class="p-2 fw-lighter text-white" id="todayName">${getDayName(forecast[0].date)}</small>
        <small class="p-2 fw-lighter text-white" id="todayDate">${getDayNumber(forecast[0].date) + getMonthName(forecast[0].date)}</small>
      </div>
      <div class="card-body">
        <p class="pt-3 px-3" id="country">${location.name}</p>
        <div class="d-flex justify-content-between flex-wrap mx-3">
          <h2 class="card-title ps-md-2 ms-3" id="todayTemp">${current.temp_c + '℃'}</h2>
          <img src="${'https:' + current.condition.icon}" class="f-img me-3" alt="..." id="todayTempImg">
        </div>
        <small class="fw-lighter p-3 d-block" id="todayTempDesc">${current.condition.text}</small>
        <div class="weather-extra p-3 pb-4">
          <img src="img/icon-umberella.png" alt="">
          <p class="fw-lighter py-3 pe-2 d-inline-block" id="todayRain">${forecast[0].day.daily_chance_of_rain + ' %'}</p>
          <img src="img/icon-wind.png" alt="">
          <p class="fw-lighter py-3 pe-2 d-inline-block" id="todayWind">${current.wind_kph + ' km/h'}</p>
          <img src="img/icon-compass.png" alt="">
          <p class="fw-lighter py-3 d-inline-block" id="todayCompass">${current.wind_dir}</p>
        </div>
      </div>
    </div>
  </div>
  `;

  for (let i = 1; i < forecast.length; i++) {
    let cardPos = 'card-m';
    (i % 2 == 0) ? cardPos = 'card-r' : '';
  
    weatherHTML += `
    <div class="col-lg-3 px-0 text-white">
    <div class="${cardPos} pb-3 h-100">
      <div class="card-top text-center py-1">
        <small class="fw-lighter text-white" id="tomorrowName">${getDayName(forecast[i].date)}</small>
      </div>
      <div class="card-body">
        <div class="text-center pt-5">
          <img src="${'https:' + forecast[0].day.condition.icon}" class="img-fluid" alt="..." id="tomorrowTempImg">
          <h2 class="fs-5 pt-3" id="tomorrowMaxTemp">${forecast[i].day.maxtemp_c + '℃'}</h2>
          <p class="" id="tomorrowLowTemp">${forecast[i].day.mintemp_c}</p>
          <small class="fw-lighter mb-5 d-block" id="tomorrowTempDesc">${forecast[i].day.condition.text}</small>
        </div>
      </div>
    </div>
  </div>
  `;
  }
  weatherDiv.innerHTML += weatherHTML;
}

function getDayName(date) {
  const objDate = new Date(date);
  return objDate.toLocaleDateString(language, { weekday: 'long' });
}

function getMonthName(date) {
  const objDate = new Date(date);
  return objDate.toLocaleDateString(language, { month: 'short' });
}

function getDayNumber(date) {
  const objDate = new Date(date);
  return objDate.toLocaleDateString(language, { day: 'numeric' });;
}
