document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const searchButton = document.querySelector('.search-button');
        if (searchButton) {
            searchButton.click();
        }
    }
});


const 
    userLocation = document.getElementById("userLocation"),
    converter = document.getElementById("converter"),
    weatherIcon = document.querySelector(".weatherIcon"),
    temperature = document.querySelector(".temperature"),
    feelsLike = document.querySelector(".feelsLike"),
    description = document.querySelector(".description"),
    date = document.querySelector(".date"),
    city = document.querySelector(".city"),

    HValue = document.getElementById("HValue"),
    WSValue = document.getElementById("WSValue"),
    SRValue = document.getElementById("SRValue"),
    SSValue = document.getElementById("SSValue"),
    CValue = document.getElementById("CValue"),
    UIValue = document.getElementById("UIValue"),
    PValue = document.getElementById("PValue"),

    Forecast = document.querySelector(".Forecast");
    
WEATHER_API_ENDPOINT= `https://api.openweathermap.org/data/2.5/weather?appid=a5bb4718b30b6f58f58697997567fffa&q=`;
WEATHER_DATA_ENDPOINT=`https://api.openweathermap.org/data/2.5/onecall?appid=a5bb4718b30b6f58f58697997567fffa&exclude=minutely&units=metric&`;
function finduserLocation(){
    Forecast.innerHTML="";
    fetch(WEATHER_API_ENDPOINT + userLocation.value)
    .then((response)=>response.json())
    .then((data)=>{
        if(data.cod!='' && data.cod!=200){
            alert(data.message);
            return;
        }
        console.log(data);
        
        city.innerHTML=data.name + "," + data.sys.country;
        weatherIcon.style.background=`url( https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png)`;


        fetch(WEATHER_DATA_ENDPOINT + `lon=${data.coord.lon}&lat=${data.coord.lat}`)
        .then((response)=>response.json())
        .then((data)=>{
            console.log(data);

            temperature.innerHTML=Tempconverter(data.current.temp);
            feelsLike.innerHTML="Feels like:- " + data.current.feels_like;
            description.innerHTML=data.current.weather[0].description;

            const options={
                weekday: "long", month:"long", day:"numeric", hour: "numeric", minute:"numeric", hour12:true,
            };
            date.innerHTML=getLongFormatDateTime(data.current.dt,data.timezone_offset,options);

            HValue.innerHTML=Math.round(data.current.humidity)+"<span class='units'>%</span>";
            WSValue.innerHTML=Math.round(data.current.wind_speed)+"<span class='units'> Km/h</span>"; 
            const options1 = {
                hour:"numeric",  minute:"numeric", hour12:true,
            }
            SRValue.innerHTML=" :- " + getLongFormatDateTime(data.current.sunrise,data.timezone_offset,options1);
            SSValue.innerHTML=" :- " + getLongFormatDateTime(data.current.sunset,data.timezone_offset,options1);  
            CValue.innerHTML=Math.round(data.current.clouds)+"<span class='units'>%</span>";
            UIValue.innerHTML=Math.round(data.current.uvi);
            PValue.innerHTML=Math.round(data.current.pressure)+"<span class='units'> hPa</span>";   
            
            data.daily.forEach((weather)=>{
                let div = document.createElement("div");
                div.className = "sub-div";
                const options={
                    weekday: "long", month:"long", day:"numeric",
                };
                let daily = getLongFormatDateTime(weather.dt,0,options).split(" at ");
                div.innerHTML= daily[0];
                div.innerHTML+=`<img src=https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png></img>`;

                div.innerHTML+=`<p class="forecast-desc">${weather.weather[0].description}</p>`;
                div.innerHTML+=`<span><span>${Tempconverter(weather.temp.min)}</span>&nbsp;&#x2f;&nbsp;<span>${Tempconverter(weather.temp.max)}</span></span>`

                Forecast.append(div);
            })
        });
    });
}

function formatUnixTime(dtValue,offSet,options={}){
    const date = new Date((dtValue + offSet)*1000);
    return date.toLocaleTimeString([],{timeZone:"UTC", ...options});
}
function getLongFormatDateTime(dtValue, offSet, options){
    return formatUnixTime(dtValue,offSet,options);
}

function Tempconverter(temp) {
    let tempValue = Math.round(Number(temp));
    let message = "";

    if (typeof converter !== 'undefined' && converter.value) {
        if (converter.value == "°C" || converter.value == "&deg;C") {
            message = tempValue + "<span> °C</span>";
        } else {
            let ctof = (tempValue * 9) / 5 + 32;
            ctof = Math.round(ctof);
            message = ctof + "<span> °F</span>";
        }
    } else {
        console.error("Converter element or its value is not defined.");
    }

    return message;
}
