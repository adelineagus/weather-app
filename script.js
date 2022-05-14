var searchCityEl= document.querySelector('#search-city');
var searchButtonEl= document.querySelector('#search-button');
var currentConditionEl=document.querySelector('#current-condition');
var futureConditionEl=document.querySelector('#future-condition');
//var cityNameEl="";
var myKey= "efca7ff5dc8054e6d9ce1c4750e12c5f";

searchButtonEl.addEventListener('click',function(event){
    event.preventDefault();
    var cityNameEl= document.querySelector("#city-name").value;
    findCoordinate(cityNameEl);
})

function findCoordinate(cityNameEl){
    var coordinateUrl= 'http://api.openweathermap.org/geo/1.0/direct?q='+cityNameEl+'&limit='+ 1 +'&appid='+myKey;
    fetch (coordinateUrl)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            var latCity=data[0].lat;
            var lonCity=data[0].lon;
            searchAPI(latCity,lonCity);
        })
 }


 function searchAPI(latCity, lonCity){
    var oneCallUrl= 'https://api.openweathermap.org/data/2.5/onecall?lat='+latCity+'&lon='+lonCity+'&appid='+myKey+'&units=imperial';
    console.log(oneCallUrl);
    fetch(oneCallUrl)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            console.log(data);
            var currentTemp= document.createElement('p');
            currentTemp.innerHTML= data.current.temp;
            var currentWind= document.createElement('p');
            currentWind.innerHTML=data.current.wind_speed;
            var currentHumidity=document.createElement('p');
            currentHumidity.innerHTML=data.current.humidity;
            var currentUV=document.createElement('p');
            currentUV.innerHTML=data.current.uvi;
            currentConditionEl.append(currentTemp,currentWind,currentHumidity,currentUV);

            for(var i=0;i<5;i++){
                var futureTemp=document.createElement('p');
                var futureWind=document.createElement('p');
                var futureUV=document.createElement('p');
                var futureHumidity=document.createElement('p');
                var weatherCard=document.createElement('div');
                weatherCard.classList.add('card');
                var weatherContent=document.createElement('div');
                weatherContent.classList.add('card-content');
                futureTemp.innerHTML=data.daily[i].temp.day;
                futureWind.innerHTML=data.daily[i].wind_speed;
                futureHumidity.innerHTML=data.daily[i].humidity;
                futureUV.innerHTML=data.daily[i].uvi;
                weatherContent.append(futureTemp,futureWind,futureHumidity,futureUV);
                weatherCard.append(weatherContent);
                futureConditionEl.append(weatherCard);
            }
        })
     
 }

/*function showResults(){

    var resultCard=document.createElement('div');
    var futureTempEl= document.createElement('p');
    futureTempEl.textContent=futureTemp;
 }*/

//http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
//https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
//'https://api.openweathermap.org/data/2.5/weather?q=Seattle&appid=efca7ff5dc8054e6d9ce1c4750e12c5f";