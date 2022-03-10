var details = {
    features: [],
};
var center;

//layergroup handle

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




$('#searchBtn').click(function() {
    $('#items').toggleClass('hide');
})


//button for details box
var customControl =  L.Control.extend({        
    options: {
      position: 'topleft'
    },
    onAdd: function (map) {
      var containerDet = L.DomUtil.create('div', 'bi bi-list infoBtn leaflet-control leaflet-bar');
      containerDet.onclick = function(){
        //$('#chartContainer').addClass('hide');
        $('#details').toggleClass('hide');
        $(this).toggleClass('bi-list');
        $(this).toggleClass('bi-x');
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
        $('#chartContainer').toggleClass('hide');
        //$('#details').addClass('hide');
        $(this).toggleClass('bi-eyedropper');
        $(this).toggleClass('bi-x');
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
        url: dataUrl
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
    })
    

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
$.when(geoInfo, capitalFetch, earthQuake, weather, webcam, covid).then(function (data1, data2, data3, data4, data6, data7) {

//geoinfo info
$('#countryName').html(data1[0]['data'][0]['countryName']);
$('#capitalCity').html(data1[0]['data'][0]['capital']);
$('#continentName').html(data1[0]['data'][0]['continentName']);
$('#languages').html(data1[0]['data'][0]['languages']);
$('#aresqkm').html(data1[0]['data'][0]['areaInSqKm']);
$('#currency').html(data1[0]['data'][0]['currencyCode']);
$('#population').html(data1[0]['data'][0]['population']);
$('#countryCode').html(data1[0]['data'][0]['countryCode']);

//covid stat
let covidData = data7[0]['data'].dates[date].countries[countryName];

var chart = new CanvasJS.Chart("chartContainer",
    {
        title: {
            text: covidData.name + ": Today Covid Stat at " + covidData.date             
        },
        data: [              
        {
            // Change type to "doughnut", "line", "splineArea", etc.
            type: "column",
            dataPoints: [
                { label: "Confirmed",  y: covidData.today_confirmed  },
                { label: "Deaths", y: covidData.today_deaths  },
                { label: "Recovered", y: covidData.today_recovered  },
                { label: "Open Cases",  y: covidData.today_open_cases  }
            ]
        }
        ]
    });
    chart.render();
//end of covid stat

//capital mark
var capitalIcon = L.icon({
    iconUrl: './libs/img/capital.png',
    shadowUrl: './libs/img/shadow.png',
});
var lonCapital = data2[0]['data'][0]['lng'];
var latCapital = data2[0]['data'][0]['lat'];
var capitalLocation = new L.LatLng(latCapital, lonCapital);
var capitalMark = new L.Marker(capitalLocation, {icon: capitalIcon});
capitalMark.bindPopup(`${data2[0]['data'][0]['title']}<br><details>${data2[0]['data'][0]['summary']}</details><br><a target="_blank" href="http://${data2[0]['data'][0]['wikipediaUrl']}">Wikipedia</a>`);
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


//webcam clustergroups
var webcamData = data6[0]['data']['result']['webcams'];
var webcamIcon = L.icon({
    iconUrl: './libs/img/cam.png',
    shadowUrl: './libs/img/shadow.png',
});
var webcam = L.markerClusterGroup();
var webcamMarkers = [];
for(var i=0; i<data4[0]['data'].length; i++) {
    webcamMarkers.push(L.marker([webcamData[i].location.latitude, webcamData[i].location.longitude], {icon: webcamIcon}).bindPopup(`Picture about ${webcamData[i].title}<img src="${webcamData[i].image.current.thumbnail}"/>`));
}
for(var i=0; i< data4[0]['data'].length; i++) {
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
//end of .when() method    
}).fail(error);

//end of updateALl
};

//----------------------------------------------------------------
//ONLOAD FUNCTION
//----------------------------------------------------------------

$(window).on('load',function() {







//preloader
    if($('#preloader').length) {
        $('#preloader').delay(1000).fadeOut('slow', function() {
            $(this).remove();
        });
    }



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
function highlightFeature(e) {
    var layer = e.target;
    layer.setStyle(hooverStyle);
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}
function resetHighlight(e) {
    geojson.resetStyle(e.target);
};
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



    var layer = e.target;
    center = layer.getBounds().getCenter();
    $('#items').val(layer.feature.properties.iso_a2)
    map.fitBounds(layer.getBounds());
    updateAll();
};

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: updateCountryClick
    });
}

//onchange function
$( "#items" ).change(function() {
    var changeVal = $('#items').val();
    geojson.eachLayer(function (layer) {
        var id = layer.feature.properties.iso_a2;
        if(id === changeVal) {
            layer.setStyle(hooverStyle);
            map.fitBounds(layer.getBounds());
            updateAll();
        }
      });
  });



//end of onchange function
//start current location
map.locate({setView: true, maxZoom: 5});

function onLocationFound(e) {
//position buttons
        var position =  L.Control.extend({        
            options: {
            position: 'topleft'
            },
            onAdd: function (map) {
            var container = L.DomUtil.create('div', 'bi bi-cursor-fill infoBtn leaflet-control leaflet-bar');
            container.onclick = function(){
                var location = L.marker(e.latlng).bindPopup("You are here");
                map.addLayer(location);
            }

            return container;
            }
        });
        map.addControl(new position());

        var currentLatLng = fetchData(
            {lat : e.latlng.lat, lng : e.latlng.lng,}, './libs/php/countryCode.php'
        );
        currentLatLng.done(function(data) {
                    $('#items').val(data['data'].countryCode);
                    $('#items').find('option:selected').text(data['data'].countryName);
                    //call the functional functions with the rest of the api call
                    updateAll();
        })
};
map.on('locationfound', onLocationFound);
function onLocationError(e) {
    alert(e.message);
}

map.on('locationerror', onLocationError);


//end of current locatio
//add all of the country layer
var getFeatures = fetchData(
        {}, './libs/php/countryBorders.php'
    );
getFeatures.done(function(data1){

    details.features.push(data1['data'].features);
    var countryCode = data1['data'].features;

    for(var i = 0; i < countryCode.length; i++) {
        var option = '';
        var iso_a2 = countryCode[i].properties.iso_a2;
        var name = countryCode[i].properties.name;
        option += '<option value="'+ iso_a2 + '">' + name + '</option>';      
        $('#items').append(option);

    }

 geojson = L.geoJson(countryCode, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);  
//endo of country layer
}).fail(error);
    




//end of onload function
});