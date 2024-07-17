const temp = document.getElementById("temp"),
    date = document.getElementById("date-time"),
    currentLocation = document.getElementById("location"),
    condition = document.getElementById("condition"),
    rain = document.getElementById("rain"),
    mainIcon = document.getElementById("icon"),
    uvIndex = document.querySelector(".uv-index"),
    uvText = document.querySelector(".uv-text"),
    windSpeed = document.querySelector(".wind-speed"),
    sunRise = document.querySelector(".sun-rise"),
    sunSet = document.querySelector(".sun-set"),
    humidity = document.querySelector(".humidity"),
    visibility = document.querySelector(".visibility"),
    humidityStatus = document.querySelector(".humidity-status"),
    airQuality = document.querySelector(".air-quality"),
    airQualityStatus = document.querySelector(".air-quality-status"),
    visibilityStatus = document.querySelector(".visibility-status"),
    weatherCards = document.querySelector("#weather-cards"),
    celciusBtn = document.querySelector(".celcius"),
    fahrenheitBtn = document.querySelector(".fahrenheit"),
    hourlyBtn = document.querySelector(".hourly"),
    weekBtn = document.querySelector(".week"),
    tempUnit = document.querySelectorAll(".temp-unit"),
    searchForm = document.querySelector("#search"),
    search = document.querySelector("#query");


let currentCity = "";
let currentUnit = "c";
let hourlyorWeek = "Week";

// Update date time
function getDateTime() {
    let now = new Date(),
        hour = now.getHours(),
        minute = now.getMinutes();

    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];

    let ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour ? hour : 12; // The hour '0' should be '12'

    if (hour < 10) {
        hour = "0" + hour;
    }
    if (minute < 10) {
        minute = "0" + minute;
    }

    let dayString = days[now.getDay()];
    return `${dayString}, ${hour}:${minute} ${ampm}`;
}

// Set the date and time initially
date.innerText = getDateTime();

// Update the date and time every second
setInterval(() => {
    date.innerText = getDateTime();
}, 1000);

// Function to get public IP address and city
function getPublicIp() {
    fetch("https://geolocation-db.com/json/", {
        method: "GET",
        headers: {},
    })
        .then((response) => response.json())
        .then((data) => {
            currentCity = data.city;
            getWeatherData(data.city, currentUnit, hourlyorWeek);
        // })
        // .catch((err) => {
        //     console.error(err);
        });
}
// Call the function to get public IP and city
getPublicIp();

// Example function to get weather data
function getWeatherData(city, unit, period) {
    const unitGroup = unit === "c" ? "metric" : "us";

    fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=J3DLL6UEZH9TTP9GK9MSY5VMJ&contentType=json`,
    {
      method: "GET",
      headers: {},
    }
  )
        .then((response) => response.json())
        .then((data) => {
            console.log(data); // Log the entire response for debugging
            let today = data.currentConditions;
            if (unit === "c") {
                temp.innerText = `${Math.round(today.temp)}`;
            } else {
                temp.innerText = `${celciusToFahrenheit(today.temp)}`;
            }
            currentLocation.innerText = data.resolvedAddress;
            condition.innerText = today.conditions;
            rain.innerText = `Perc - ${today.precip || 0}%`;
            uvIndex.innerText = today.uvindex;
            windSpeed.innerText = `${today.windspeed} km/h`; // Add appropriate unit
            humidity.innerText = `${today.humidity}%`;
            visibility.innerText = `${today.visibility} km`; // Add appropriate unit
            airQuality.innerText = `${today.winddir}°`; // Assuming wind direction
            measureUvIndex(today.uvindex);
            updateHumidityStatus(today.humidity);
            updateVisibilityStatus(today.visibility);
            updateAirQualityStatus(today.winddir);

            sunRise.innerText = convertTimeto12HourFormat(today.sunrise);
            sunSet.innerText = convertTimeto12HourFormat(today.sunset);


            mainIcon.src = getIcon(today.icon);
            changeBackground(today.icon);

            if (period === "hourly") {
                updateForecast(data.days[0].hours, unit, "hour");
            } else {
                updateForecast(data.days, unit, "week");
            }

        })
        .catch((err) => {
            alert("City not found in our database");

        });

  //  console.log(`Fetching weather data for ${city}, ${unit}, ${period}`);
}

// Function to convert Celsius to Fahrenheit
function celciusToFahrenheit(celsius) {
    return Math.round((celsius * 9) / 5 + 32);
}

// function to get uv index status
function measureUvIndex(uvIndex)
{
  if (uvIndex <= 2) {
    uvText.innerText = "Low";
  } else if (uvIndex <= 5) {
    uvText.innerText = "Moderate";
  } else if (uvIndex <= 7) {
    uvText.innerText = "High";
  } else if (uvIndex <= 10) {
    uvText.innerText = "Very High";
  } else {
    uvText.innerText = "Extreme";
  }
}

// Example function to update humidity status
function updateHumidityStatus(humidity) {
    if (humidity <= 30) {
        humidityStatus.innerText = "Low";
    } else if (humidity <= 60) {
        humidityStatus.innerText = "Moderate";
    } else {
        humidityStatus.innerText = "High";
    }
}

// function to get visibility status
function updateVisibilityStatus(visibility) {
    if (visibility <= 0.03) {
        visibilityStatus.innerText = "Dense Fog";
    } else if (visibility <= 0.16) {
        visibilityStatus.innerText = "Moderate Fog";
    } else if (visibility <= 0.35) {
        visibilityStatus.innerText = "Light Fog";
    } else if (visibility <= 1.13) {
        visibilityStatus.innerText = "Very Light Fog";
    } else if (visibility <= 2.16) {
        visibilityStatus.innerText = "Light Mist";
    } else if (visibility <= 5.4) {
        visibilityStatus.innerText = "Very Light Mist";
    } else if (visibility <= 10.8) {
        visibilityStatus.innerText = "Clear Air";
    } else {
        visibilityStatus.innerText = "Very Clear Air";
    }
}

// function to get air quality status
function updateAirQualityStatus(airquality) {
    if (airquality <= 50) {
        airQualityStatus.innerText = "Good👌";
    } else if (airquality <= 100) {
        airQualityStatus.innerText = "Moderate😐";
    } else if (airquality <= 150) {
        airQualityStatus.innerText = "Unhealthy for Sensitive Groups😷";
    } else if (airquality <= 200) {
        airQualityStatus.innerText = "Unhealthy😷";
    } else if (airquality <= 250) {
        airQualityStatus.innerText = "Very Unhealthy😨";
    } else {
        airQualityStatus.innerText = "Hazardous😱";
    }
}

function convertTimeto12HourFormat(time) {
    let [hour, minute] = time.split(":").map(Number);
    let period = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12; // Convert hour 0 to 12 for AM/PM format
    if (hour === 0) hour = "00"; // Change 12 to 00 for midnight
    hour = hour < 10 ? "0" + hour : hour;
    minute = minute < 10 ? "0" + minute : minute;
    return `${hour}:${minute} ${period}`;
}


function getIcon(condition) {
  if (condition === "partly-cloudy-day") {
    return "https://i.ibb.co/PZQXH8V/27.png";
  } else if (condition === "partly-cloudy-night") {
    return "https://i.ibb.co/Kzkk59k/15.png";
  } else if (condition === "rain") {
    return "https://i.ibb.co/kBd2NTS/39.png";
  } else if (condition === "clear-day") {
    return "https://i.ibb.co/rb4rrJL/26.png";
  } else if (condition === "clear-night") {
    return "https://i.ibb.co/1nxNGHL/10.png";
  } else {
    return "https://i.ibb.co/rb4rrJL/26.png"; // Default icon for unknown conditions
  }
}



// function to change background depending on weather conditions
function changeBackground(condition) {
  const body = document.querySelector("body");
  let bg = "";
  if (condition === "partly-cloudy-day") {
    bg = "https://i.ibb.co/qNv7NxZ/pc.webp";
  } else if (condition === "partly-cloudy-night") {
    bg = "https://i.ibb.co/RDfPqXz/pcn.jpg";
  } else if (condition === "rain") {
    bg = "https://i.ibb.co/h2p6Yhd/rain.webp";
  } else if (condition === "clear-day") {
    bg = "https://i.ibb.co/WGry01m/cd.jpg";
  } else if (condition === "clear-night") {
    bg = "https://i.ibb.co/kqtZ1Gx/cn.jpg";
  } else {
    bg = "https://i.ibb.co/qNv7NxZ/pc.webp";
  }
  body.style.backgroundImage = `linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ),url(${bg})`;
}


function getHour(time) {
  let [hour, minute] = time.split(":").map(Number);
  let period = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12; // Convert hour 0 to 12 for AM/PM format
  return `${hour}:${minute < 10 ? "0" + minute : minute} ${period}`;
}




// function to get day name from date
function getDayName(date) {
  let day = new Date(date);
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[day.getDay()];
}

function updateForecast(data, unit, type) {
  weatherCards.innerHTML = "";
  let numCards = type === "hour" ? 24 : 7; // Display 24 hours for today, or 7 days for weekly
  for (let i = 0; i < numCards; i++) {
    let card = document.createElement("div");
    card.classList.add("card");

    let dayName = type === "hour" ? getHour(data[i].datetime) : getDayName(data[i].datetime);
    let dayTemp = data[i].temp;
    if (unit === "f") {
      dayTemp = celciusToFahrenheit(data[i].temp);
    }
    let iconCondition = data[i].icon;
    let iconSrc = getIcon(iconCondition);
    let tempUnit = unit === "f" ? "°F" : "°C";

    card.innerHTML = `
      <h2 class="day-name">${dayName}</h2>
      <div class="card-icon">
        <img src="${iconSrc}" class="day-icon" alt="" />
      </div>
      <div class="day-temp">
        <h2 class="temp">${dayTemp}</h2>
        <span class="temp-unit">${tempUnit}</span>
      </div>
    `;
    weatherCards.appendChild(card);
  }
}



fahrenheitBtn.addEventListener("click", () => {
  changeUnit("f");
});
celciusBtn.addEventListener("click", () => {
  changeUnit("c");
});

// function to change unit
function changeUnit(unit) {
  if (currentUnit !== unit) {
    currentUnit = unit;
    tempUnit.forEach((elem) => {
      elem.innerText = `°${unit.toUpperCase()}`;
    });
    if (unit === "c") {
      celciusBtn.classList.add("active");
      fahrenheitBtn.classList.remove("active");
    } else {
      celciusBtn.classList.remove("active");
      fahrenheitBtn.classList.add("active");
    }
    getWeatherData(currentCity, currentUnit, hourlyorWeek);
  }
}

hourlyBtn.addEventListener("click", () => {
  changeTimeSpan("hourly");
});
weekBtn.addEventListener("click", () => {
  changeTimeSpan("week");
});

function changeTimeSpan(unit)
{
  if(hourlyorWeek !== unit)
  {
    hourlyorWeek = unit;
    if(unit === "hourly")
    {
      hourlyBtn.classList.add("active");
      weekBtn.classList.remove("active");
    }
    else {
      hourlyBtn.classList.remove("active");
      weekBtn.classList.add("active");
    }
    // update weather on time change
    getWeatherData(currentCity, currentUnit, hourlyorWeek);

  }
}
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let location = search.value.trim(); // Trim whitespace from input
  if (location) {
    currentCity = location;
    getWeatherData(currentCity, currentUnit, hourlyorWeek);
  }
});

var currentFocus;

search.addEventListener("input", function(e) {
  removeSuggestions();
  var a, b, i, val = this.value.trim(); // Trim whitespace from input

  if (!val) {
    return false;
  }
  currentFocus = -1;

  a = document.createElement("ul");
  a.setAttribute("id", "suggestions");

  this.parentNode.appendChild(a);

  for (i = 0; i < cities.length; i++) {
    if (cities[i].substr(0, val.length).toUpperCase() === val.toUpperCase()) {
      b = document.createElement("li");

      b.innerHTML = "<strong>" + cities[i].substr(0, val.length) + "</strong>";
      b.innerHTML += cities[i].substr(val.length);
      b.innerHTML += "<input type='hidden' value='" + cities[i] + "'>";

      b.addEventListener("click", function(e) {
        search.value = this.querySelector("input").value; // Corrected to querySelector
        removeSuggestions();
      });

      a.appendChild(b);
    }
  }
});

function removeSuggestions() {
  var x = document.getElementById("suggestions");
  if (x) {
    x.parentNode.removeChild(x);
  }
}

search.addEventListener("keydown", function(e) {
  var x = document.getElementById("suggestions");

  if (x) {
    x = x.getElementsByTagName("li"); // Corrected from getElementByIdTagName

    if (e.keyCode == 40) {
      currentFocus++;
      addActive(x);
    } else if (e.keyCode == 38) {
      currentFocus--;
      addActive(x);
    } else if (e.keyCode == 13) {
      e.preventDefault();
      if (currentFocus > -1) {
        if (x) x[currentFocus].click(); // Corrected from clic()
      }
    }
  }
});

function addActive(x) {
  if (!x) return false;
  removeActive(x);

  if (currentFocus >= x.length) currentFocus = 0;
  if (currentFocus < 0) currentFocus = x.length - 1;

  x[currentFocus].classList.add("active");
}

function removeActive(x) {
  for (var i = 0; i < x.length; i++) {
    x[i].classList.remove("active");
  }
}

var cities = [
  // Indian cities
  "Mumbai (India)", "Delhi (India)", "Bangalore (India)", "Hyderabad (India)",
  "Chennai (India)", "Kolkata (India)", "Pune (India)", "Ahmedabad (India)",
  "Jaipur (India)", "Surat (India)", "Lucknow (India)", "Kanpur (India)",
  "Nagpur (India)", "Indore (India)", "Thane (India)", "Bhopal (India)",
  "Visakhapatnam (India)", "Pimpri-Chinchwad (India)", "Patna (India)",
  "Vadodara (India)", "Nashik (India)", "Aurangabad (India)", "Solapur (India)",
  "Amravati (India)", "Kolhapur (India)", "Navi Mumbai (India)", "Akola (India)",
  "Ahmednagar (India)", "Jalgaon (India)", "Panvel (India)", "Satara (India)",
  "Sangli (India)", "Latur (India)", "Malegaon (India)", "Dhule (India)",
  "Ichalkaranji (India)", "Chandrapur (India)", "Parbhani (India)",
  "Guwahati (India)", "Ranchi (India)", "Gwalior (India)", "Vijayawada (India)",
  "Jabalpur (India)", "Madurai (India)", "Raipur (India)", "Kota (India)",
  "Chandigarh (India)", "Mysore (India)", "Bareilly (India)", "Aligarh (India)",
  "Guntur (India)", "Jodhpur (India)", "Tiruppur (India)", "Bhubaneswar (India)",
  "Salem (India)", "Warangal (India)", "Mira-Bhayandar (India)", "Gurgaon (India)",

  // USA cities
  "New York (USA)", "Los Angeles (USA)", "Chicago (USA)", "Houston (USA)",
  "Phoenix (USA)", "Philadelphia (USA)", "San Antonio (USA)", "San Diego (USA)",
  "Dallas (USA)", "San Jose (USA)", "Austin (USA)", "Jacksonville (USA)",
  "San Francisco (USA)", "Indianapolis (USA)", "Columbus (USA)", "Fort Worth (USA)",
  "Charlotte (USA)", "Seattle (USA)", "Denver (USA)", "Washington (USA)",
  "Boston (USA)", "El Paso (USA)", "Detroit (USA)", "Nashville (USA)",
  "Portland (USA)", "Las Vegas (USA)", "Memphis (USA)", "Louisville (USA)",
  "Baltimore (USA)", "Milwaukee (USA)", "Albuquerque (USA)", "Tucson (USA)",
  "Fresno (USA)", "Sacramento (USA)", "Kansas City (USA)", "Long Beach (USA)",
  "Mesa (USA)", "Atlanta (USA)", "Omaha (USA)", "Raleigh (USA)", "Miami (USA)",

  // Japanese cities
  "Tokyo (Japan)", "Yokohama (Japan)", "Osaka (Japan)", "Nagoya (Japan)",
  "Sapporo (Japan)", "Fukuoka (Japan)", "Kobe (Japan)", "Kyoto (Japan)",
  "Kawasaki (Japan)", "Saitama (Japan)", "Hiroshima (Japan)", "Sendai (Japan)",
  "Kitakyushu (Japan)", "Chiba (Japan)", "Sakai (Japan)", "Niigata (Japan)",
  "Hamamatsu (Japan)", "Okayama (Japan)", "Kumamoto (Japan)", "Sagamihara (Japan)",
  "Kagoshima (Japan)", "Matsumoto (Japan)", "Himeji (Japan)", "Shizuoka (Japan)",
  "Utsunomiya (Japan)", "Matsuyama (Japan)", "Nagasaki (Japan)", "Kanazawa (Japan)",
  "Oita (Japan)", "Akita (Japan)", "Gifu (Japan)", "Tokushima (Japan)",
  "Toyama (Japan)", "Wakayama (Japan)", "Nara (Japan)", "Yamagata (Japan)",
  "Fukushima (Japan)", "Miyazaki (Japan)", "Nagano (Japan)", "Takamatsu (Japan)",

  // Russian cities
  "Moscow (Russia)", "Saint Petersburg (Russia)", "Novosibirsk (Russia)",
  "Yekaterinburg (Russia)", "Nizhny Novgorod (Russia)", "Kazan (Russia)",
  "Chelyabinsk (Russia)", "Omsk (Russia)", "Samara (Russia)", "Rostov-on-Don (Russia)",
  "Ufa (Russia)", "Krasnoyarsk (Russia)", "Voronezh (Russia)", "Perm (Russia)",
  "Volgograd (Russia)", "Krasnodar (Russia)", "Saratov (Russia)", "Tyumen (Russia)",
  "Tolyatti (Russia)", "Izhevsk (Russia)", "Barnaul (Russia)", "Ulyanovsk (Russia)",
  "Irkutsk (Russia)", "Khabarovsk (Russia)", "Yaroslavl (Russia)", "Vladivostok (Russia)",
  "Makhachkala (Russia)", "Tomsk (Russia)", "Orenburg (Russia)", "Kemerovo (Russia)",
  "Novokuznetsk (Russia)", "Ryazan (Russia)", "Astrakhan (Russia)", "Penza (Russia)",
  "Lipetsk (Russia)", "Tula (Russia)", "Kirov (Russia)", "Cheboksary (Russia)",
  "Kaliningrad (Russia)", "Kursk (Russia)",

  // English cities
  "London (England)", "Birmingham (England)", "Leeds (England)", "Sheffield (England)",
  "Manchester (England)", "Liverpool (England)", "Bristol (England)", "Newcastle (England)",
  "Sunderland (England)", "Wolverhampton (England)", "Southampton (England)",
  "Portsmouth (England)", "Nottingham (England)", "Derby (England)", "Leicester (England)",
  "Coventry (England)", "Bradford (England)", "Hull (England)", "Stoke-on-Trent (England)",
  "Plymouth (England)", "Brighton (England)", "Luton (England)", "Reading (England)",
  "Northampton (England)", "Milton Keynes (England)", "Norwich (England)", "Swindon (England)",
  "Oxford (England)", "Cambridge (England)", "Peterborough (England)", "Gloucester (England)",
  "Exeter (England)", "Salisbury (England)", "Worcester (England)", "York (England)",
  "Bath (England)", "Chester (England)", "Hereford (England)", "Canterbury (England)",
  "Lancaster (England)",

  // Chinese cities
  "Beijing (China)", "Shanghai (China)", "Guangzhou (China)", "Shenzhen (China)",
  "Tianjin (China)", "Chengdu (China)", "Nanjing (China)", "Wuhan (China)",
  "Xi'an (China)", "Hangzhou (China)", "Chongqing (China)", "Shenyang (China)",
  "Harbin (China)", "Qingdao (China)", "Dalian (China)", "Jinan (China)",
  "Zhengzhou (China)", "Changsha (China)", "Kunming (China)", "Nanchang (China)",
  "Fuzhou (China)", "Wuxi (China)", "Suzhou (China)", "Xiamen (China)",
  "Ningbo (China)", "Changchun (China)", "Taiyuan (China)", "Hefei (China)",
  "Shijiazhuang (China)", "Nanning (China)", "Urumqi (China)", "Lanzhou (China)",
  "Yinchuan (China)", "Haikou (China)", "Guiyang (China)", "Lhasa (China)",
  "Xining (China)", "Hohhot (China)", "Zhongshan (China)", "Zhuhai (China)",

  // Italian cities
  "Rome (Italy)", "Milan (Italy)", "Naples (Italy)", "Turin (Italy)",
  "Palermo (Italy)", "Genoa (Italy)", "Bologna (Italy)", "Florence (Italy)",
  "Bari (Italy)", "Catania (Italy)", "Venice (Italy)", "Verona (Italy)",
  "Messina (Italy)", "Padua (Italy)", "Trieste (Italy)", "Taranto (Italy)",
  "Brescia (Italy)", "Parma (Italy)", "Prato (Italy)", "Modena (Italy)",
  "Reggio Calabria (Italy)", "Reggio Emilia (Italy)", "Perugia (Italy)",
  "Ravenna (Italy)", "Livorno (Italy)", "Cagliari (Italy)", "Foggia (Italy)",
  "Salerno (Italy)", "Ferrara (Italy)", "Latina (Italy)", "Giugliano (Italy)",
  "Monza (Italy)", "Siracusa (Italy)", "Pescara (Italy)", "Bergamo (Italy)",
  "Trento (Italy)", "Forli (Italy)", "Vicenza (Italy)", "Terni (Italy)",
  "Ancona (Italy)",

  // Australia cities
"Sydney (Australia)", "Melbourne (Australia)", "Brisbane (Australia)", "Perth (Australia)",
"Adelaide (Australia)", "Gold Coast (Australia)", "Canberra (Australia)", "Newcastle (Australia)",
"Wollongong (Australia)", "Logan City (Australia)", "Geelong (Australia)", "Hobart (Australia)",
"Townsville (Australia)", "Cairns (Australia)", "Toowoomba (Australia)", "Darwin (Australia)",
"Launceston (Australia)", "Ballarat (Australia)", "Bendigo (Australia)", "Mackay (Australia)",

// canada cities
"Toronto (Canada)", "Montreal (Canada)", "Vancouver (Canada)", "Calgary (Canada)",
"Edmonton (Canada)", "Ottawa (Canada)", "Quebec City (Canada)", "Winnipeg (Canada)",
"Hamilton (Canada)", "Kitchener (Canada)", "London (Canada)", "Victoria (Canada)",
"St. Catharines (Canada)", "Halifax (Canada)", "Oshawa (Canada)", "Windsor (Canada)",
"Saskatoon (Canada)", "Regina (Canada)", "Barrie (Canada)", "Sherbrooke (Canada)"

];
