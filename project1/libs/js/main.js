
$(window).on('load', function() {
    $("#cover").fadeOut(5000);
});


var center;
var geojson;

var baseLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiYmFsaW50MTEyMCIsImEiOiJja3p3cDA3MnQ2eDRoMnVvMTVvYzE5amVyIn0.EqtGAs4TYbk6mB6l0DRP4A'
});


var satellite = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/satellite-v9',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiYmFsaW50MTEyMCIsImEiOiJja3p3cDA3MnQ2eDRoMnVvMTVvYzE5amVyIn0.EqtGAs4TYbk6mB6l0DRP4A'
});


var map = L.map('map',{
    center: [0,0],
    zoom: 2,
    layers: satellite
});



var baseMaps = {
    "Satellite Map": satellite,
    "Street Map": baseLayer,
};

function centerLeafletMapOnMarker(map, marker) {
var latLngs = [ marker.getLatLng() ];
var markerBounds = L.latLngBounds(latLngs);
map.fitBounds(markerBounds);
};

//weatherClick function

function weatherClick(e){
    $('#preloader').removeClass('hide');

    var weatherSome = fetchData({
            lat: e.latlng.lat,
            lon: e.latlng.lng
        }, './libs/php/weatherModal.php');

weatherSome.done(function(info){
// Weather main data
$('#preloader').addClass('hide');

let data = info['data'];
let main = data.current.weather[0].main;
let description = data.current.weather[0].description;
let temp = Math.round(data.current.temp);
let pressure = data.current.pressure;
let humidity = data.current.humidity;
var celsius = "<sup>°</sup>C";
//let name = data1[0]['data'][0].capital;

$('#wrapper-description').html(description.toUpperCase());
$('#wrapper-temp').html(temp + celsius);
$('#wrapper-pressure').html(pressure + ' bara');
$('#wrapper-humidity').html(humidity + "%");
//$('#wrapper-name').html(name);


// Weather hourly data
let hourNow = Math.round(data.hourly[0].temp * 10) / 10;
let hour1 = Math.round(data.hourly[1].temp * 10) / 10 ;
let hour2 = Math.round(data.hourly[2].temp * 10) / 10 ;
let hour3 = Math.round(data.hourly[3].temp * 10) / 10 ;
let hour4 = Math.round(data.hourly[4].temp * 10) / 10 ;
let hour5 = Math.round(data.hourly[5].temp * 10) / 10 ;


$('#wrapper-hour-now').html(hourNow + celsius);
$('#wrapper-hour1').html(hour1 + celsius);
$('#wrapper-hour2').html(hour2 + celsius);
$('#wrapper-hour3').html(hour3 + celsius);
$('#wrapper-hour4').html(hour4 + celsius);
$('#wrapper-hour5').html(hour5 + celsius);

// Time
let timeNow = new Date().getHours();

//timeNow = (timeNow + 24) % 24;
function clock(num) {
    if(num == 0){ //At 00 hours we need to show 12 am
        num = 12;
        return num + 'am';
    } else if (24 < num) {
        num = num - 24;
        return num + 'am';
    } else if (12 < num) {
        num = num % 12;
        return num + 'pm';
    } else {
        return num + 'am';
    }
}

let time1 = clock(timeNow + 1);
let time2 = clock(timeNow + 2);
let time3 = clock(timeNow + 3);
let time4 = clock(timeNow + 4);
let time5 = clock(timeNow + 5);


$('#wrapper-time1').html(time1);
$('#wrapper-time2').html(time2);
$('#wrapper-time3').html(time3);
$('#wrapper-time4').html(time4);
$('#wrapper-time5').html(time5);


let today = new Date();
let tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
let daftomorrow = new Date(today);
daftomorrow.setDate(daftomorrow.getDate() + 2);

var ddT = today.getDate();
var mmT = today.getMonth() + 1;
var yyyyT = today.getFullYear();

var ddTo = tomorrow.getDate();
var mmTo = tomorrow.getMonth() + 1;
var yyyyTo = tomorrow.getFullYear();

var ddATo = daftomorrow.getDate();
var mmATo = daftomorrow.getMonth() + 1;
var yyyyATo = daftomorrow.getFullYear();

if (ddT < 10 ) {ddT = '0' + ddT};
if(ddTo < 10) {ddTo = '0' + ddTo};
if(ddATo < 10) {ddATo = '0' + ddATo};
if(mmT < 10) {mmT = '0' + mmT};
if(mmTo < 10) {mmTo = '0' + mmTo};
if(mmATo < 10) {mmATo = '0' + mmATo};

var dateT = yyyyT + '-' + mmT + '-' + ddT;
var dateTo = yyyyTo + '-' + mmTo + '-' + ddTo;
var dateATo = yyyyATo + '-' + mmATo + '-' + ddATo;

$('#today').html(dateT);
$('#tomorrow').html(dateTo);
$('#daftomorrow').html(dateATo);

// Weather daily data
let tomorrowTemp = Math.round(data.daily[0].temp.day);
let dATTemp = Math.round(data.daily[1].temp.day);
let tomorrowMain = data.daily[0].weather[0].main;
let dATTempMain = data.daily[1].weather[0].main;
  
$('#wrapper-forecast-temp-today').html(temp + celsius);
$('#wrapper-forecast-temp-tomorrow').html(tomorrowTemp + celsius);
$('#wrapper-forecast-temp-dAT').html(dATTemp + celsius);
  

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

    })

}

//zoom in buttons

var zoomIn =  L.Control.extend({        
    options: {
      position: 'topleft'
    },
    onAdd: function (map) {
      var containerDet = L.DomUtil.create('div', 'bi bi-zoom-in infoBtn');
      containerDet.onclick = function(){
        map.zoomIn();; 
      }
      return containerDet;
    }
  });
  map.addControl(new zoomIn());

//zoom out button
var zoomOut =  L.Control.extend({        
    options: {
      position: 'topleft'
    },
    onAdd: function (map) {
      var containerDet = L.DomUtil.create('div', 'bi bi-zoom-out infoBtn');
      containerDet.onclick = function(){
        map.zoomOut();; 
      }
      return containerDet;
    }
  });
  map.addControl(new zoomOut());
//button for details box
var customControl =  L.Control.extend({        
    options: {
      position: 'topleft'
    },
    onAdd: function (map) {
      var containerDet = L.DomUtil.create('div', 'bi bi-info infoBtn');
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
      var container = L.DomUtil.create('div', 'bi bi-eyedropper infoBtn');
      container.onclick = function(){
        $('#covid').modal('show'); 
      }

      return container;
    }
  });
  map.addControl(new covidBtn());

//end of covid stat button

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
    let placeCode;
    if($('#items').val() === 'GB') {
        placeCode = 'UK'
    } else {
        placeCode = countryCode
    };
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
    var country = fetchData({iso: countryCode}, './libs/php/country.php');


//tipadvisor api call

var places = fetchData(
    {
        countryCode: placeCode
    }, './libs/php/tripadvisor.php'
    );
 
//if all of the api call success use the data
$.when(geoInfo, earthQuake, weather, webcam, covid, country, places).then(function (data1, data3, data4,data5, data6, data8, data9) {
    //geoinfo info
let geoData = data1[0]['data'][0];
var population = geoData['population'];
var wiki = 'https://en.wikipedia.org/wiki/' + countryName;
var flag = data8[0]['data']['data'].flagImageUri;



$('#countryName').html(geoData['countryName']);
$('#capitalCity').html(geoData['capital']);
$('#continentName').html(geoData['continentName']);
$('#languages').html(geoData['languages']);
$('#aresqkm').html(Number(geoData['areaInSqKm']).toLocaleString('en-US') + ' km<sup>2</sup');
$('#currency').html(geoData['currencyCode']);
$('#population').html(Number(population).toLocaleString('en-US'));
$('#countryCode').html(geoData['countryCode']);
$('#countryWiki').attr('href', wiki);
$('#flag').attr('src', flag);

//places
function showPlaces(e){
    $('#preloader').removeClass('hide'); 
    $('#places').modal('show');
    for(var i=0; i<placeData.length; i++) {
        if(e.latlng.lat == placeData[i].coordinates.latitude && e.latlng.lng == placeData[i].coordinates.longitude) {
            $('#placeWiki').attr('href', placeData[i].attribution[1].url)
            $('#wrapper-name').html(placeData[i].name);
            $('#title').html(placeData[i].name);
            $('#snipet').html(placeData[i].snippet);
            for(var j = 0; j < placeData[i].images.length; j++){
                $('.imgItem')[j].src = placeData[i].images[j].sizes.medium.url;
                $('#preloader').addClass('hide');
             };

        }
    }
};

var placeIcon = L.icon({
    iconUrl: './libs/img/capital.png',
    shadowUrl: './libs/img/shadow.png',
    popupAnchor: [15, 3],
});

var placeData = data9[0]['data'].results;

var places = L.markerClusterGroup();
places.on('click', showPlaces);
places.on('click', weatherClick);
var placesMarkers = [];
for(var i=0; i< placeData.length; i++) {
    placesMarkers.push(L.marker([placeData[i].coordinates.latitude, placeData[i].coordinates.longitude], {icon: placeIcon}));
}
for(var i=0; i< placeData.length; i++) {
    places.addLayer(placesMarkers[i]);
};
map.addLayer(places);


$('#showMap').click(function() {
    $('#weatherModal').modal('show');
    $('#places').modal('hide');
});
//covid stat
let covidData;
if(data6[0]['data']) {
    covidData = data6[0]['data'].dates[date].countries[countryName];
}


if(covidData) {
$('#covidHead').html(geoData['countryName'])
$('#newConf').html(Number(covidData.today_new_confirmed).toLocaleString('en-US') );
$('#newRec').html(Number(covidData.today_new_recovered).toLocaleString('en-US') );
$('#newDeath').html(Number(covidData.today_new_deaths).toLocaleString('en-US') );
$('#totalConf').html(Number(covidData.today_confirmed).toLocaleString('en-US') );
$('#totalRec').html(Number(covidData.today_recovered).toLocaleString('en-US') );
$('#totalDeath').html(Number(covidData.today_deaths).toLocaleString('en-US') );
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

//earthquake layer
var earthquakeIcon = L.icon({
    iconUrl: './libs/img/caution.png',
    shadowUrl: './libs/img/shadow.png',
    popupAnchor:  [15, 3],
    iconAnchor:   [-3, -3],
});
var earthquakes = L.markerClusterGroup();
var markers = [];
for(var i=0; i< data3[0]['data'].length; i++) {
  
   markers.push(L.marker([data3[0]['data'][i].lat, data3[0]['data'][i].lng], {icon: earthquakeIcon}).bindPopup('Earthquake Info<br>' + '<br>Data Time: ' + data3[0]['data'][i].datetime.slice(0,10) + '<br>Depth: ' + data3[0]['data'][i].depth + '<br>Magnitude: ' + data3[0]['data'][i].magnitude + '<br>Src: ' + data3[0]['data'][i].src));
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
function show(){
    $('#wrapper-name').html('');
    $('#weatherModal').modal('show');
}

var weatherIcon = L.icon({
    iconUrl: './libs/img/weather.png',
    shadowUrl: './libs/img/shadow.png',
    popupAnchor:  [15, 3]
});
var weather = L.markerClusterGroup();
weather.on('click', weatherClick);
weather.on('click', show);
var weatherMarkers = [];
for(var i=0; i<data4[0]['data'].length; i++) {
    weatherMarkers.push(L.marker([data4[0]['data'][i].lat, data4[0]['data'][i].lng], {icon: weatherIcon}));
}
for(var i=0; i< data4[0]['data'].length; i++) {
    weather.addLayer(weatherMarkers[i]);
};
map.addLayer(weather);


//webcam clustergroups

function webcamClick(e){
    $('#webcamModal').modal('show');
    for(var i=0; i<webcamData.length; i++) {
        if(e.latlng.lat == webcamData[i].location.latitude && e.latlng.lng == webcamData[i].location.longitude){
            $('#player').attr('src',webcamData[i].player.day.embed)
    }
}
}

var webcamData = data5[0]['data']['result']['webcams'];
var webcamIcon = L.icon({
    iconUrl: './libs/img/cam.png',
    shadowUrl: './libs/img/shadow.png',
    popupAnchor:  [15, 3]
});
var webcam = L.markerClusterGroup();
var webcamMarkers = [];
for(var i=0; i<webcamData.length; i++) {
    webcamMarkers.push(L.marker([webcamData[i].location.latitude, webcamData[i].location.longitude], {icon: webcamIcon}));
}
for(var i=0; i< webcamData.length; i++) {
    webcam.addLayer(webcamMarkers[i]);
};
map.addLayer(webcam);
webcam.on('click', webcamClick);

//map controller
var overlayMaps = {
    "Earthquakes": earthquakes,
    "Places": places,
    "Weather": weather,
    "Webcam": webcam,
};

var controller = L.control.layers(baseMaps, overlayMaps);
controller.addTo(map);


$('#preloader').addClass('hide');
//end of .when() method    
}).fail(error);

//end of updateALl
};

//----------------------------------------------------------------
//ONLOAD FUNCTION
//----------------------------------------------------------------

    $('.leaflet-control-zoom').remove();

    var hooverStyle = {
        fillColor: 'lightGrey',
        weight: 3,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.3
    };
//add all of the country layer and fill up options
var getFeatures = fetchData({}, './libs/php/countryBorders.php');
getFeatures.done(function(data1){
    var countryCode = data1['data'];
    for(var i = 0; i < countryCode.length; i++) {
        var option = '';
        var iso_a2 = countryCode[i].code;
        var name = countryCode[i].name;
        option += '<option value="'+ iso_a2 + '">' + name + '</option>';      
        $('#items').append(option);

    }
//endo of country layer
}).fail(error);


function updateCountryClick(e) {
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
            popupAnchor:  [15, 3]
        });
        var findNearbyCluster = L.markerClusterGroup();
        var findNearbyMarkers = [];
        for(var i=0; i<data5['data'].length; i++) {
            findNearbyMarkers.push(L.marker([data5['data'][i].lat, data5['data'][i].lng], {icon: findNearby}).bindPopup('<p>' + data5['data'][i].title + '</p><span>' + data5['data'][i].summary + '</span><a target="_blank" href="http://' + data5['data'][i].wikipediaUrl + '">' + '<p>Wikipedia</p></a>'));
        }
        for(var i=0; i< data5['data'].length; i++) {
            findNearbyCluster.addLayer(findNearbyMarkers[i]);
        };
        map.addLayer(findNearbyCluster);
    });
};
//map.on('click', updateCountryClick);

//current location details
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
                    var code = data['data'].countryCode;
                    var currentFeature = fetchData({iso: code}, './libs/php/countryGeo.php');
                    currentFeature.done(function(data) {
                        geojson = L.geoJson(data['data'], {
                            style: hooverStyle,
                        }).addTo(map);
                        map.fitBounds(geojson.getBounds());
                        geojson.on('click', updateCountryClick);
                        center = geojson.getBounds().getCenter();
                    });
                    //call the functional functions with the rest of the api call
                    updateAll();
        });   
    });
} else {
    alert('Please, enable the location');
};
//end of load current location

$( "#items" ).change(function() {
    $('#preloader').removeClass('hide');
    map.removeLayer(geojson);
    var isoCode = $('#items').val();
    var geometry = fetchData({iso: isoCode}, './libs/php/countryGeo.php');   
    geometry.done(function(data) {
        geojson = L.geoJson(data['data'], {
            style: hooverStyle,
        }).addTo(map);
        map.fitBounds(geojson.getBounds());
        center = geojson.getBounds().getCenter();
    });
    updateAll();
  });
  
//end of onload function