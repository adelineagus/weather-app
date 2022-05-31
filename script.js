var searchCityEl= document.querySelector('#search-city');
var searchButtonEl= document.querySelector('#search-button');
var historySectionEl=document.querySelector('#history-section');
var currentConditionEl=document.querySelector('#current-condition');
var futureTitle=document.querySelector('#future-title');
var futureConditionEl=document.querySelector('#future-condition');

var cityAll=[];
var myKey= "efca7ff5dc8054e6d9ce1c4750e12c5f";

if(JSON.parse(localStorage.getItem("cities"))){
    getCity();
}

searchButtonEl.addEventListener('click',function(event){
    event.preventDefault();
    var cityNameEl= document.querySelector("#city-name").value;
    if (!cityNameEl){
        return;
    }
    
    findCoordinate(cityNameEl);

    var cityExist=0;
    if(JSON.parse(localStorage.getItem("cities"))){
        cityAll=JSON.parse(localStorage.getItem("cities"));
    }

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
    document.querySelector("#city-name").value='';
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
        cityButton.setAttribute("style", "font-size:15px; width:100%; background-color:gray; margin-bottom:10px");
        historySectionEl.append(cityButton);
        
        cityButton.addEventListener('click', function(event){
            var clickedCity=event.target;
            console.log(clickedCity.getAttribute("city"));
            findCoordinate(clickedCity.getAttribute("city"));
        })
    }
}

function findCoordinate(cityName){
    var coordinateUrl= 'https://api.openweathermap.org/geo/1.0/direct?q='+cityName+'&limit='+ 1 +'&appid='+myKey;
    console.log(coordinateUrl);
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

            futureTitle.innerHTML= "5-Day Forecast:";
            futureConditionEl.textContent='';

            for(var i=1;i<6;i++){
                futureData(data.daily[i]);
            }
        })
     
}

function currentData(data,cityName){
    var newDate= new Date(data.current.dt * 1000);
    console.log(newDate);
    var currentDate= newDate.getDate();
    var currentMonth= newDate.getMonth()+1;
    console.log(currentMonth);
    var currentYear= newDate.getFullYear();

    var currentconditionTitle=document.createElement('div');
    var currentIcon= document.createElement('img');
    var currentTitle= document.createElement('h2');
    var currentTemp= document.createElement('p');
    var currentWind= document.createElement('p');
    var currentHumidity=document.createElement('p');
    var currentUV=document.createElement('p');
    var currentuvTitle=document.createElement('p');
    var currentuvAll=document.createElement('div');


    currentTitle.innerHTML=cityName + ' (' + currentMonth+ '/'+ currentDate + '/'+ currentYear + ') ';
    currentIcon.src= 'https://openweathermap.org/img/wn/'+(data.current.weather[0].icon)+'@2x.png';
    currentconditionTitle.append(currentTitle, currentIcon);
    currentconditionTitle.style.display="flex";

    currentTemp.innerHTML= 'Temp: '+ data.current.temp + ' \u00B0F';
    currentWind.innerHTML='Wind: '+ data.current.wind_speed + ' MPH';
    currentHumidity.innerHTML='Humidity: '+ data.current.humidity+ ' %' ;
    currentUV.innerHTML= data.current.uvi;
    

    var setColor="";
    if(data.current.uvi>=0 && data.current.uvi<=3){
        setColor="green";
    } else if(data.current.uvi>=3 && data.current.uvi<=6){
        setColor="yellow";
    }else if(data.current.uvi>=6 && data.current.uvi<=8){
        setColor="orange";
    } else if(data.current.uvi >=8 && data.current.uvi<=11){
        setColor= "red";
    } else{
        setColor= "purple";
    }

    currentUV.style.backgroundColor= setColor;
    currentUV.style.display="inline-block";
    currentuvTitle.innerHTML= 'UV Index:  '
    currentuvTitle.style.display="inline-block";
    currentuvAll.append(currentuvTitle, currentUV);

    
    currentConditionEl.append(currentconditionTitle, currentTemp,currentWind,currentHumidity,currentuvAll);
    currentConditionEl.setAttribute("style", "border: solid; padding:10px; margin-left:20px");
}

function futureData(dailyData){
    var newDate= new Date(dailyData.dt * 1000);
    var futureDate= newDate.getDate();
    var futureMonth= newDate.getMonth()+1;
    var futureYear= newDate.getFullYear();

    var futureTitle= document.createElement('h3');
    var futureIcon= document.createElement('img');

    var futureTemp=document.createElement('p');
    var futureWind=document.createElement('p');
    var futureHumidity=document.createElement('p');
    var weatherCard=document.createElement('div');
    weatherCard.classList.add('card');
    
    var weatherContent=document.createElement('div');
    //weatherContent.classList.add('card-content');
    
    futureTitle.innerHTML= futureMonth+ '/'+ futureDate + '/'+ futureYear;
    futureIcon.src= 'https://openweathermap.org/img/wn/'+(dailyData.weather[0].icon)+'@2x.png';
    futureTemp.innerHTML= 'Temp: '+ dailyData.temp.day + ' \u00B0F';
    futureWind.innerHTML='Wind: '+ dailyData.wind_speed + ' MPH';
    futureHumidity.innerHTML= 'Humidity: '+ dailyData.humidity+ ' %' ;

    
    weatherContent.append(futureTitle, futureIcon, futureTemp,futureWind,futureHumidity);
    weatherCard.append(weatherContent);
    futureConditionEl.append(weatherCard);
    futureConditionEl.style.display="flex";
}
