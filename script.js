var searchCityEl= document.querySelector('#search-city');
var searchButtonEl= document.querySelector('#search-button');
var historySectionEl=document.querySelector('#history-section');
var currentConditionEl=document.querySelector('#current-condition');
var futureConditionEl=document.querySelector('#future-condition');
var cityAll=[];
var myKey= "efca7ff5dc8054e6d9ce1c4750e12c5f";

searchButtonEl.addEventListener('click',function(event){
    event.preventDefault();
    var cityNameEl= document.querySelector("#city-name").value;
    findCoordinate(cityNameEl);
    var cityExist=0;
    for(var i=0;i<cityAll.length;i++){
        if (cityAll[i]==cityNameEl){
            cityExist++;
        }
    }
    if (cityExist==0){
        cityAll.push(cityNameEl);
    }
    localStorage.setItem("cities",JSON.stringify(cityAll));
    getCity();
})


function getCity(cityButton){
    var cityStored=JSON.parse(localStorage.getItem("cities"));
    while (historySectionEl.firstChild){
        historySectionEl.removeChild(historySectionEl.firstChild);
    }

    for(var i=0;i<cityStored.length;i++){
        var cityButton= document.createElement('button');
        cityButton.textContent=cityStored[i];
        cityButton.setAttribute("city",cityStored[i]);
        historySectionEl.append(cityButton);
        
        cityButton.addEventListener('click', function(event){
            var clickedCity=event.target;
            console.log(clickedCity.getAttribute("city"));
            findCoordinate(clickedCity.getAttribute("city"));
        })
    }
}

function findCoordinate(cityName){
    var coordinateUrl= 'http://api.openweathermap.org/geo/1.0/direct?q='+cityName+'&limit='+ 1 +'&appid='+myKey;
    fetch (coordinateUrl)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            var latCity=data[0].lat;
            var lonCity=data[0].lon;
            searchAPI(latCity,lonCity,cityName);
        })
}


function searchAPI(latCity, lonCity,cityName){
    var oneCallUrl= 'https://api.openweathermap.org/data/2.5/onecall?lat='+latCity+'&lon='+lonCity+'&appid='+myKey+'&units=imperial';
    console.log(oneCallUrl);
    fetch(oneCallUrl)
        .then(function(response){
            return response.json();
        })

        .then(function(data){
            console.log(data);
            currentConditionEl.textContent='';
            currentData(data,cityName);

            futureConditionEl.textContent='';
            for(var i=1;i<6;i++){
                futureData(data.daily[i]);
            }
        })
     
}

function currentData(data,cityName){
    var newDate= new Date(data.current.dt * 1000);
    var currentDate= newDate.getDate();
    var currentMonth= newDate.getMonth();
    var currentYear= newDate.getFullYear();

    var currentTitle= document.createElement('h2');
    var currentTemp= document.createElement('p');
    var currentWind= document.createElement('p');
    var currentHumidity=document.createElement('p');
    var currentUV=document.createElement('p');
    
    currentTitle.innerHTML=cityName + ' (' + currentMonth+ '/'+ currentDate + '/'+ currentYear + ')';
    currentTemp.innerHTML= 'Temp: '+ data.current.temp + ' \u00B0F';
    currentWind.innerHTML='Wind: '+ data.current.wind_speed + ' MPH';
    currentHumidity.innerHTML='Humidity: '+ data.current.humidity+ ' %' ;
    currentUV.innerHTML= 'UV Index: ' + data.current.uvi;
    
    currentConditionEl.append(currentTitle, currentTemp,currentWind,currentHumidity,currentUV);
}

function futureData(dailyData){
    var newDate= new Date(dailyData.dt * 1000);
    var futureDate= newDate.getDate();
    var futureMonth= newDate.getMonth();
    var futureYear= newDate.getFullYear();

    var futureTitle= document.createElement('h2');
    var futureTemp=document.createElement('p');
    var futureWind=document.createElement('p');
    var futureUV=document.createElement('p');
    var futureHumidity=document.createElement('p');
    
    var weatherCard=document.createElement('div');
    weatherCard.classList.add('card');
    
    var weatherContent=document.createElement('div');
    weatherContent.classList.add('card-content');
    
    futureTitle.innerHTML= futureMonth+ '/'+ futureDate + '/'+ futureYear;
    futureTemp.innerHTML= 'Temp: '+ dailyData.temp.day + ' \u00B0F';
    futureWind.innerHTML='Wind: '+ dailyData.wind_speed + ' MPH';
    futureHumidity.innerHTML= 'Humidity: '+ dailyData.humidity+ ' %' ;

    
    weatherContent.append(futureTitle, futureTemp,futureWind,futureHumidity,futureUV);
    weatherCard.append(weatherContent);
    futureConditionEl.append(weatherCard);
}

/*function showResults(){

    var resultCard=document.createElement('div');
    var futureTempEl= document.createElement('p');
    futureTempEl.textContent=futureTemp;
 }*/

//http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
//https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
//'https://api.openweathermap.org/data/2.5/weather?q=Seattle&appid=efca7ff5dc8054e6d9ce1c4750e12c5f";