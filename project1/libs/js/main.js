/*
$(window).on('load',function() {

    //preloader
        if($('#preloader').length) {
            $('#preloader').delay(3000).fadeOut('slow', function() {
                $(this).addClass('hide');
            });
        };

    

});
*/
var center;

var map = L.map('map',{
    center: [0,0],
    zoom: 2,
});


var baseLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiYmFsaW50MTEyMCIsImEiOiJja3p3cDA3MnQ2eDRoMnVvMTVvYzE5amVyIn0.EqtGAs4TYbk6mB6l0DRP4A'
}).addTo(map);


//button for details box
var customControl =  L.Control.extend({        
    options: {
      position: 'topleft'
    },
    onAdd: function (map) {
      var containerDet = L.DomUtil.create('div', 'bi bi-list infoBtn leaflet-control leaflet-bar');
      containerDet.onclick = function(){
        $('#countryInfo').modal('show'); 
      }
      return containerDet;
    }
  });
  map.addControl(new customControl());
//end of details box button
//button for covid status
var covidBtn =  L.Control.extend({        
    options: {
      position: 'topleft'
    },
    onAdd: function (map) {
      var container = L.DomUtil.create('div', 'bi bi-eyedropper infoBtn leaflet-control leaflet-bar');
      container.onclick = function(){
        $('#covid').modal('show'); 
      }

      return container;
    }
  });
  map.addControl(new covidBtn());

//end of covid stat button
//weather button
var weather =  L.Control.extend({        
    options: {
      position: 'topleft'
    },
    onAdd: function (map) {
      var container = L.DomUtil.create('div', 'bi bi-sun-fill infoBtn leaflet-control leaflet-bar');
      container.onclick = function(){
        $('#weatherModal').modal('show'); 
      }

      return container;
    }
  });
  map.addControl(new weather());

//endo of weather button

var fetchData = function(query, dataUrl) {
    return $.ajax({
        data: query,
        dataType: 'json',
        url: dataUrl,
    });
};
var error = function(jqXHR, textStatus, errorThrown) {
    var errorMessage = jqXHR.status + ': ' + jqXHR.statusText
    alert('Error - ' + errorMessage);
};


//----------------------------------------------------------------
//ULTIMATE FUNCTIONS
//----------------------------------------------------------------


function updateAll(){

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    var date = yyyy + '-' + mm + '-' + dd;
    
    let countryCode = $('#items').val();
    let countryName = $('#items').find('option:selected').text();
    countryName.split(' ').join('_');

    $('.leaflet-control-layers').remove();
    $('.leaflet-control-layers-toggle').remove();
    map.eachLayer(function(layer) {
        if (layer instanceof L.MarkerClusterGroup || layer instanceof L.Marker)
        {
            map.removeLayer(layer)
        }
    });
    

//call apis
//all of ajax call returns
    //geoInfo api
    var geoInfo = fetchData(
        {
            countryCode: countryCode
        }, './libs/php/countryInfo.php'
        );

//wikipedia url ajax call
    var capitalFetch = geoInfo.then(function (data) {
        return fetchData(
            {
                capital: data['data'][0]['capital']
            }, './libs/php/wikipedia.php'
        )
    });

//weatherModal api capitalLocation
    var weatherModal = capitalFetch.then(function(data){
        return fetchData({
            lat: data['data'][1].lat,
            lon: data['data'][1].lng
        }, './libs/php/weatherModal.php')
    })


//earthquake api call
    var earthQuake = geoInfo.then(function(data){
        return fetchData(
            {
                north: data['data'][0]['north'],
                south: data['data'][0]['south'],
                east: data['data'][0]['east'],
                west: data['data'][0]['west']
            }, './libs/php/earthquake.php'
        )
    });
//weather api call
    var weather = geoInfo.then(function (data) {
        return fetchData(
            {
            north: data['data'][0]['north'],
            south: data['data'][0]['south'],
            east: data['data'][0]['east'],
            west: data['data'][0]['west'] 
            }, './libs/php/weather.php'
        )
    });
//webcam api call
    var webcam = fetchData(
        {
            countryCode: countryCode
        }, './libs/php/webcam.php'
        );
//covid api call
    var covid = fetchData(
        {
            date: date,
            countryName: countryName

        }, './libs/php/covid.php'
        );

//if all of the api call success use the data
$.when(geoInfo, capitalFetch, earthQuake, weather, webcam, covid, weatherModal).then(function (data1, data2, data3, data4,data5, data6, data7) {
//geoinfo info
let geoData = data1[0]['data'][0];

$('#countryName').html(geoData['countryName']);
$('#capitalCity').html(geoData['capital']);
$('#continentName').html(geoData['continentName']);
$('#languages').html(geoData['languages']);
$('#aresqkm').html(geoData['areaInSqKm']);
$('#currency').html(geoData['currencyCode']);
$('#population').html(geoData['population']);
$('#countryCode').html(geoData['countryCode']);

//covid stat
let covidData;
if(data6[0]['data']) {
    covidData = data6[0]['data'].dates[date].countries[countryName];
}


if(covidData) {
$('#covidHead').html(geoData['countryName'])
$('#newConf').html(covidData.today_new_confirmed);
$('#newRec').html(covidData.today_new_recovered);
$('#newDeath').html(covidData.today_new_deaths);
$('#totalConf').html(covidData.today_confirmed);
$('#totalRec').html(covidData.today_recovered);
$('#totalDeath').html(covidData.today_deaths);
} else {
    $('#covidHead').html('There is no')
    $('#newConf').html('');
    $('#newRec').html('');
    $('#newDeath').html('');
    $('#totalConf').html('');
    $('#totalRec').html('');
    $('#totalDeath').html(''); 
}


//end of covid stat

//capital mark
var capitalIcon = L.icon({
    iconUrl: './libs/img/capital.png',
    shadowUrl: './libs/img/shadow.png',
});
var lonCapital = data2[0]['data'][1]['lng'];
var latCapital = data2[0]['data'][1]['lat'];
var capitalLocation = new L.LatLng(latCapital, lonCapital);
var capitalMark = new L.Marker(capitalLocation, {icon: capitalIcon});
capitalMark.bindPopup(`${data2[0]['data'][1]['title']}<br><details>${data2[0]['data'][1]['summary']}</details><br><a target="_blank" href="http://${data2[0]['data'][1]['wikipediaUrl']}">Wikipedia</a>`);
map.addLayer(capitalMark);

//earthquake layer
var earthquakeIcon = L.icon({
    iconUrl: './libs/img/caution.png',
    shadowUrl: './libs/img/shadow.png',
});
var earthquakes = L.markerClusterGroup();
var markers = [];
for(var i=0; i< data3[0]['data'].length; i++) {
  
   markers.push(L.marker([data3[0]['data'][i].lat, data3[0]['data'][i].lng], {icon: earthquakeIcon}).bindPopup('Earthquake Info<br>' + '<br>Data Time: ' + data3[0]['data'][i].datetime + '<br>Depth: ' + data3[0]['data'][i].depth + '<br>Magnitude: ' + data3[0]['data'][i].magnitude + '<br>Src: ' + data3[0]['data'][i].src));
};
for(var i=0; i< data3[0]['data'].length; i++) {
    earthquakes.addLayer(markers[i]);
};
if(markers.length != 0) {
    map.addLayer(earthquakes);
} else{
    var text = L.popup()
    .setLatLng([center.lat, center.lng])
    .setContent("This is a lucky country, it has not been earthquake yet.").openPopup()
    .openOn(map);
    text.addTo(map);
}

//weather clustergroups
var weatherIcon = L.icon({
    iconUrl: './libs/img/weather.png',
    shadowUrl: './libs/img/shadow.png',
});
var weather = L.markerClusterGroup();
var weatherMarkers = [];
for(var i=0; i<data4[0]['data'].length; i++) {
    weatherMarkers.push(L.marker([data4[0]['data'][i].lat, data4[0]['data'][i].lng], {icon: weatherIcon}).bindPopup('Weather Information<br>'+ '<br>Station: ' + data4[0]['data'][i].stationName + '<br>Date: ' + data4[0]['data'][i].datetime + '<br>Clouds: ' + data4[0]['data'][i].clouds + '<br>Temp: ' + data4[0]['data'][i].temperature + '<br>WindSpeed: ' + data4[0]['data'][i].windSpeed));
}
for(var i=0; i< data4[0]['data'].length; i++) {
    weather.addLayer(weatherMarkers[i]);
};
map.addLayer(weather);
//weatherModel api handle

// Weather main data
let data = data7[0]['data'];
let main = data.current.weather[0].main;
let description = data.current.weather[0].description;
let temp = Math.round(data.current.temp);
let pressure = data.current.pressure;
let humidity = data.current.humidity;
let name = data1[0]['data'][0].capital;

$('#wrapper-description').html(description);
$('#wrapper-temp').html(temp + "°C");
$('#wrapper-pressure').html(pressure);
$('#wrapper-humidity').html(humidity + "°C");
$('#wrapper-name').html(name);


// Weather hourly data
let hourNow = data.hourly[0].temp;
let hour1 = data.hourly[1].temp;
let hour2 = data.hourly[2].temp;
let hour3 = data.hourly[3].temp;
let hour4 = data.hourly[4].temp;
let hour5 = data.hourly[5].temp;


$('#wrapper-hour-now').html(hourNow + "°");
$('#wrapper-hour1').html(hour1 + "°");
$('#wrapper-hour2').html(hour2 + "°");
$('#wrapper-hour3').html(hour3 + "°");
$('#wrapper-hour4').html(hour4 + "°");
$('#wrapper-hour5').html(hour5 + "°");

// Time
let timeNow = new Date().getHours();
let time1 = timeNow + 1;
let time2 = time1 + 1;
let time3 = time2 + 1;
let time4 = time3 + 1;
let time5 = time4 + 1;

$('#wrapper-time1').html(time1);
$('#wrapper-time2').html(time2);
$('#wrapper-time3').html(time3);
$('#wrapper-time4').html(time4);
$('#wrapper-time5').html(time5);

// Weather daily data
let tomorrowTemp = Math.round(data.daily[0].temp.day);
let dATTemp = Math.round(data.daily[1].temp.day);
let tomorrowMain = data.daily[0].weather[0].main;
let dATTempMain = data.daily[1].weather[0].main;
  
$('#wrapper-forecast-temp-today').html(temp + "°");
$('#wrapper-forecast-temp-tomorrow').html(tomorrowTemp + "°");
$('#wrapper-forecast-temp-dAT').html(dATTemp + "°");
  

// Icons
let iconBaseUrl = "http://openweathermap.org/img/w/";
let iconFormat = ".png";

// Today
let iconCodeToday = data.current.weather[0].icon;
let iconFullyUrlToday = iconBaseUrl + iconCodeToday + iconFormat;
$("#wrapper-icon-today").attr("src", iconFullyUrlToday);

// Tomorrow
let iconCodeTomorrow = data.daily[0].weather[0].icon;
let iconFullyUrlTomorrow = iconBaseUrl + iconCodeTomorrow + iconFormat;
$("#wrapper-icon-tomorrow").attr("src", iconFullyUrlTomorrow);

// Day after tomorrow
let iconCodeDAT = data.daily[1].weather[0].icon;
let iconFullyUrlDAT = iconBaseUrl + iconCodeDAT + iconFormat;
$("#wrapper-icon-dAT").attr("src", iconFullyUrlDAT);

// Icons hourly

// Hour now
let iconHourNow = data.hourly[0].weather[0].icon;
let iconFullyUrlHourNow = iconBaseUrl + iconHourNow + iconFormat;
$("#wrapper-icon-hour-now").attr("src", iconFullyUrlHourNow);

// Hour1
let iconHour1 = data.hourly[1].weather[0].icon;
let iconFullyUrlHour1 = iconBaseUrl + iconHour1 + iconFormat;
$("#wrapper-icon-hour1").attr("src", iconFullyUrlHour1);

// Hour2
let iconHour2 = data.hourly[2].weather[0].icon;
let iconFullyUrlHour2 = iconBaseUrl + iconHour2 + iconFormat;
$("#wrapper-icon-hour2").attr("src", iconFullyUrlHour2);

// Hour3
let iconHour3 = data.hourly[3].weather[0].icon;
let iconFullyUrlHour3 = iconBaseUrl + iconHour3 + iconFormat;
$("#wrapper-icon-hour3").attr("src", iconFullyUrlHour3);

// Hour4
let iconHour4 = data.hourly[4].weather[0].icon;
let iconFullyUrlHour4 = iconBaseUrl + iconHour4 + iconFormat;
$("#wrapper-icon-hour4").attr("src", iconFullyUrlHour4);

// Hour5
let iconHour5 = data.hourly[5].weather[0].icon;
let iconFullyUrlHour5 = iconBaseUrl + iconHour5 + iconFormat;
$("#wrapper-icon-hour5").attr("src", iconFullyUrlHour5);

// Backgrounds
$('#wrapper-bg').css('background-size', 'cover');
$('#wrapper-bg').css('background-position', 'center');
$('#wrapper-bg').css('background-repeat', 'no-repeat');
switch (main) {
  case "Snow":
    $('#wrapper-bg').css('background-image', 'url(./libs/img/snow.gif)');
    break;
  case "Clouds":
  $('#wrapper-bg').css('background-image', 'url(./libs/img/clouds.gif)');
    break;
  case "Fog":
    $('#wrapper-bg').css('background-image', 'url(./libs/img/fog.gif)');
    break;
  case "Rain":
    $('#wrapper-bg').css('background-image', 'url(./libs/img/rain.gif)');
    break;
  case "Clear":
    $('#wrapper-bg').css('background-image', 'url(./libs/img/clear.gif)');
    break;
  case "Thunderstorm":
    $('#wrapper-bg').css('background-image', 'url(./libs/img/thunderstorm.gif)');
    break;
  default:
    $('#wrapper-bg').css('background-image', 'url(./libs/img/clear.gif)');
    break;
}

//webcam clustergroups
var webcamData = data5[0]['data']['result']['webcams'];
var webcamIcon = L.icon({
    iconUrl: './libs/img/cam.png',
    shadowUrl: './libs/img/shadow.png',
});
var webcam = L.markerClusterGroup();
var webcamMarkers = [];
for(var i=0; i<webcamData.length; i++) {
    webcamMarkers.push(L.marker([webcamData[i].location.latitude, webcamData[i].location.longitude], {icon: webcamIcon}).bindPopup(`Picture about ${webcamData[i].title}<img src="${webcamData[i].image.current.thumbnail}"/>`));
}
for(var i=0; i< webcamData.length; i++) {
    webcam.addLayer(webcamMarkers[i]);
};
map.addLayer(webcam);



//map controller
var overlayMaps = {
    "Earthquakes": earthquakes,
    "Capital": capitalMark,
    "Weather": weather,
    "Webcam": webcam,
};

var controller = L.control.layers(null, overlayMaps);
controller.addTo(map);


$('#preloader').addClass('hide');
//end of .when() method    
}).fail(error);

//end of updateALl
};

//----------------------------------------------------------------
//ONLOAD FUNCTION
//----------------------------------------------------------------

$(window).on('load',function() {

    var hooverStyle = {
        fillColor: 'lightGrey',
        weight: 3,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    }

function style(feature) {
    return {
        fillColor: '#fff',
        weight: 2,
        opacity: 1,
        color: 'none',
        dashArray: '3',
        fillOpacity: 0
    };
};

var geojson;
//add all of the country layer and fill up options
var getFeatures = fetchData({}, './libs/php/countryBorders.php');
var geometry = fetchData({}, './libs/php/countryGeo.php');


$.when(getFeatures, geometry).then(function(data1,data2){
    var countryCode = data1[0]['data'];
    for(var i = 0; i < countryCode.length; i++) {
        var option = '';
        var iso_a2 = countryCode[i].code;
        var name = countryCode[i].name;
        option += '<option value="'+ iso_a2 + '">' + name + '</option>';      
        $('#items').append(option);

    }

 geojson = L.geoJson(data2[0]['data'], {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);  
//endo of country layer
}).fail(error);

function updateCountryClick(e) {
    $('#preloader').removeClass('hide');
    geojson.resetStyle();
    var layer = e.target;
    layer.setStyle(hooverStyle);
    center = layer.getBounds().getCenter();
    $('#items').val(layer.feature.properties.iso_a2)
    map.fitBounds(layer.getBounds());
    updateAll();

//find nearby api call
    var findNearby = fetchData(
            {
                lat: e.latlng.lat,
                lng: e.latlng.lng,
            }, './libs/php/findnearby.php'
        );
    findNearby.done(function (data5) {
        var findNearby = L.icon({
            iconUrl: './libs/img/info.png',
            shadowUrl: './libs/img/shadow.png',
        });
        var findNearbyCluster = L.markerClusterGroup();
        var findNearbyMarkers = [];
        for(var i=0; i<data5['data'].length; i++) {
            findNearbyMarkers.push(L.marker([data5['data'][i].lat, data5['data'][i].lng], {icon: findNearby}).bindPopup(data5['data'][i].title + '<br><details><summery></summery><p>' + data5['data'][i].summary + '</p><a target="_blank" href="http://' + data5['data'][i].wikipediaUrl + '">' + '<p>Wikipedia</p></a></details>'));
        }
        for(var i=0; i< data5['data'].length; i++) {
            findNearbyCluster.addLayer(findNearbyMarkers[i]);
        };
        map.addLayer(findNearbyCluster);
    });


}

function onEachFeature(feature, layer) {
    layer.on({
        //mouseover: highlightFeature,
        //mouseout: resetHighlight,
        click: updateCountryClick
    });
};
//onchange function
$( "#items" ).change(function() {
    $('#preloader').removeClass('hide');
    geojson.resetStyle();
    var changeVal = $('#items').val();
    geojson.eachLayer(function (layer) {
        var id = layer.feature.properties.iso_a2;
        if(id === changeVal) {
            layer.setStyle(hooverStyle);
            map.fitBounds(layer.getBounds());
            
        }
      });
      updateAll();
  });
//end of onchange function

//start current location
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
        var latData = position.coords.latitude;
        var lngData = position.coords.longitude;
        //countrycode api call
        var currentLatLng = fetchData(
            {lat : latData, lng : lngData,}, './libs/php/countryCode.php'
        );
        currentLatLng.done(function(data) {
                    $('#items').val(data['data'].countryCode);

                    geojson.eachLayer(function (layer) {
                        var id = layer.feature.properties.iso_a2;
                        if(id === data['data'].countryCode) {
                            layer.setStyle(hooverStyle);
                            map.fitBounds(layer.getBounds());
                        }
                      });
                    //call the functional functions with the rest of the api call
                    updateAll();
        });   
    });
} else {
    alert('Please, enable the location');
}
//end of current locatio   
//end of onload function
});