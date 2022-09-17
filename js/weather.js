const API_KEY = "*****************"; // ключ (закрыт для безопасности)
let city_name = "Moscow"; // Город по умолчанию


Start(city_name);


function Start(name){

  let url =`http://api.openweathermap.org/data/2.5/forecast?q=${name}&appid=${API_KEY}`; // строка запроса

  $.get(url, function(data){ // Обращение к API
  console.log(data);
 $(".current_city").text(data.city.name); // Текущий город
 $(".current_temperature").text(getTemp(data.list[0].main.temp)); // Текущая температура
 $(".current_description").text(data.list[0].weather[0].description); // Описание текущей погоды

 let dt = data.list[0].dt;  
 for(let i = 0; i < data.list.length; i++){  //заполнение погоды на 5 дней(максимум для бесплатного аккаунта)
    if(data.list[i].dt == dt){

      let date = timeConverter(data.list[i].dt);
      let icon = data.list[i].weather[0].icon;
      let temp = getTemp(data.list[i].main.temp);

      $(".forecast").append(`<div class="forecast_item">
      <div class="forecast_time">${date}</div>
      <div class="forecast_icon icon__${icon}"></div>
      <div class="forecast_temperature">${temp}</div>
      </div>`);

      dt = dt + 86400;
    }
 }

 DayOrNight(data); 
});
}

function getTemp(value){ // Приведение температуры к необходимому виду
  let roundedValue = value.toFixed() - 273;
  return `${roundedValue}˚`
}

function timeConverter(unix_utc){ // Приведение даты к необходимому виду 
  let date = new Date(unix_utc*1000);
  let options = {day: 'numeric', month: 'short'};
  return date.toLocaleString('en-En',options); 
}

function isDay(data){  // Проверка день сейчас или нет
  let sunrise = data.city.sunrise * 1000;
  let sunset = data.city.sunset * 1000;

  let now = Date.now();
  return (now > sunrise && now < sunset);
}

function DayOrNight(data){ //Дневной, ночной режим
  let attrName = isDay(data) ? 'day' : 'night';
  $("html").attr('data-theme', attrName);
}

$(".current_city").click(function(){  // Обработка введенного города
  let name = prompt("Enter city", "Moscow"); 
  if (name == null || name == '') name = "Moscow"; 
  $(".forecast").empty();
  Start(name);
});





