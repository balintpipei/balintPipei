$(window).on('load', function() {
    if($('#preloader').length) {
        $('#preloader').delay(3000).fadeOut('slow', function() {
            $(this).remove();
        });
    }
});

var details = {
    features: [],
};
//ajax api call helper function
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


$('#changeNav').click(function () {
    $('#navbar').toggleClass('navbar');
    $('#navbar').toggleClass('navbar-mobile');
    $(this).toggleClass('bi-list');
    $(this).toggleClass('bi-x');
});
$('#rating-form').on('change','[name="rating"]',function(){
    $('#selected-rating').text($('[name="rating"]:checked').val());
   });
$(window).on("scroll", function () {
    if ($(this).scrollTop() > 100) {
        $("#header").addClass("header-scrolled");
    }
    else {
        $("#header").removeClass("header-scrolled");
    }
});

//create map with layout
var map = L.map('map').setView([47.11227, 19.096149], 4);


L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmFsaW50MTEyMCIsImEiOiJja3p3cDA3MnQ2eDRoMnVvMTVvYzE5amVyIn0.EqtGAs4TYbk6mB6l0DRP4A', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiYmFsaW50MTEyMCIsImEiOiJja3p3cDA3MnQ2eDRoMnVvMTVvYzE5amVyIn0.EqtGAs4TYbk6mB6l0DRP4A'
}).addTo(map);



//pop function if click on map
var popup = L.popup();
function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
};
map.on('click', onMapClick);



//ultimate function for onload and click event
function update() {
   
//clear previuos map items
    var items = $('#items').val();
    $(".leaflet-interactive").remove();
    $(".leaflet-popup").remove();
    $('.leaflet-marker-shadow').remove();
    $('.leaflet-bar').remove();
    $('.easy-button-container').remove();
    $('.leaflet-control').remove();

    map.eachLayer(function(layer) {
        if (layer instanceof L.MarkerClusterGroup)
        {
            map.removeLayer(layer)
        }
    })


//Updata map with the polygon geoInfo
    var center;
    for(var i=0; i< details.features.length; i++) {
            if(details.features[i].properties.iso_a2 === $('#items').val()) {
                var geojsonFeature = details.features[i];
                var feature = L.geoJSON(geojsonFeature).addTo(map);
                map.fitBounds(feature.getBounds());
                center = feature.getBounds().getCenter();
             } 
            };


//all of ajax call returns
    //geoInfo api
            var geoInfo = fetchData(
            {
                countryCode: items
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
//weaher api call
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

//find nearby api call
        var findNearby = capitalFetch.then(function (data) {
            return fetchData(
                {
                    lat: data['data'][0]['lat'],
                    lng: data['data'][0]['lng'],
                }, './libs/php/findnearby.php'
            )
        });

//if all of the api call success use the data

$.when(geoInfo, capitalFetch, earthQuake, weather, findNearby).then(function(data1, data2, data3, data4, data5) {
    

//handle geoinfo data1
        $('#countryName').html(data1[0]['data'][0]['countryName']);
        $('#capitalCity').html(data1[0]['data'][0]['capital']);
        $('#continentName').html(data1[0]['data'][0]['continentName']);
        $('#languages').html(data1[0]['data'][0]['languages']);
        $('#aresqkm').html(data1[0]['data'][0]['areaInSqKm']);
        $('#currency').html(data1[0]['data'][0]['currencyCode']);
        $('#population').html(data1[0]['data'][0]['population']);
        $('#currency').html(data1[0]['data'][0]['currencyCode']);
        $('#capitalHeader').html(data1[0]['data'][0]['capital']);
        $('#countryCode').html(data1[0]['data'][0]['countryCode']);
//handle capitalFetch data2
        var imgs = [];
        $('#capitalSummary').html(data2[0]['data'][0]['summary']);
        $('#capitalWiki').prop("href", 'http://' + data2[0]['data'][0]['wikipediaUrl']);

        for(var i=0; i<data2[0]['data'].length; i++) {
            imgs.push(data2[0]['data'][i]['thumbnailImg']);
        }
        var cnt = imgs.length;
        $(function() {
            setInterval(Slider, 3000);
        });

        function Slider() {
            $("#imageSlide").show("fast", function() {
            $(this).attr("src", imgs[(imgs.length++) % cnt]).show();
            });
        }
    //capital layer create
        var myIcon = L.icon({
            iconUrl: './libs/img/capital.png',
            shadowUrl: './libs/img/shadow.png',
        });
        var lonCapital = data2[0]['data'][0]['lng'];
        var latCapital = data2[0]['data'][0]['lat'];
        var popupTextCapital = data2[0]['data'][0]['title'];
        var capitalLocation = new L.LatLng(latCapital, lonCapital);
        var capitalMark = new L.Marker(capitalLocation, {icon: myIcon});
        capitalMark.bindPopup(popupTextCapital);
        
        
    //capitalButton.addTo(map);

        L.easyButton({
            states: [{
            stateName: 'Capital',
            icon: 'fa fa-map-pin',
            title: 'Click for Capital',
            onClick: function(control) {
                map.addLayer(capitalMark);
                control.state('remove-markers');
            }
            }, {
                icon: 'fa-undo',
                stateName: 'remove-markers',
                  title: 'Remove Capital',
                onClick: function(control) {
                map.removeLayer(capitalMark);
                control.state('Capital');
                },
                        
            }]
        }).addTo(map);
//handle earthquake data3
    //earthquake layergroup create
        var cluster2 = L.markerClusterGroup();
         var markers = [];
        for(var i=0; i< data3[0]['data'].length; i++) {
           
            markers.push(L.marker([data3[0]['data'][i].lat, data3[0]['data'][i].lng]).bindPopup('Earthquake Info<br>' + '<br>Data Time: ' + data3[0]['data'][i].datetime + '<br>Depth: ' + data3[0]['data'][i].depth + '<br>Magnitude: ' + data3[0]['data'][i].magnitude + '<br>Src: ' + data3[0]['data'][i].src));
        };
        for(var i=0; i< data3[0]['data'].length; i++) {
             cluster2.addLayer(markers[i]);
        };


    //earthquake easynutton set up                       
        L.easyButton({
            states: [{
            stateName: 'Earthquake',
            icon: 'fa-map-marker',
            title: 'Add Earthquakes Info',
            onClick: function(control) {
                if(markers.length != 0) {
                    map.addLayer(cluster2);
                } else{
                    var text = L.popup()
                    .setLatLng([center.lat, center.lng])
                    .setContent("This is a lucky country, it has not been earthquake yet.")
                    .openOn(map);
                    text.addTo(map);
                }
                
                control.state('remove-markers');
            }
            }, {
            icon: 'fa-undo',
            stateName: 'remove-markers',
            title: 'Remove Earthquakes Info',
            onClick: function(control) {
                map.removeLayer(cluster2);
                control.state('Earthquake');
            }
            }]
        }).addTo(map);

//handle weather data4
        var weatherIcon = L.icon({
            iconUrl: './libs/img/weather.png',
            shadowUrl: './libs/img/shadow.png',
        });
        var weatherCluster = L.markerClusterGroup();
        var weatherMarkers = [];
        for(var i=0; i<data4[0]['data'].length; i++) {
            weatherMarkers.push(L.marker([data4[0]['data'][i].lat, data4[0]['data'][i].lng], {icon: weatherIcon}).bindPopup('Weather Information<br>'+ '<br>Station: ' + data4[0]['data'][i].stationName + '<br>Date: ' + data4[0]['data'][i].datetime + '<br>Clouds: ' + data4[0]['data'][i].clouds + '<br>Temp: ' + data4[0]['data'][i].temperature + '<br>WindSpeed: ' + data4[0]['data'][i].windSpeed));
        }
        for(var i=0; i< data4[0]['data'].length; i++) {
            weatherCluster.addLayer(weatherMarkers[i]);
        };
        L.easyButton({
            states: [{
            stateName: 'Weather',
            icon: 'fa-cloud',
            title: 'Add Weather Info',
            onClick: function(control) {
                map.addLayer(weatherCluster);
                control.state('remove-markers');
            }
            }, {
            icon: 'fa-undo',
            stateName: 'remove-markers',
            title: 'Remove Weather Info',
            onClick: function(control) {
                map.removeLayer(weatherCluster);
                control.state('Weather');
            }
            }]
        }).addTo(map);
//findnearby data5
            var findNearby = L.icon({
                iconUrl: './libs/img/info.png',
                shadowUrl: './libs/img/shadow.png',
            });
            var findNearbyCluster = L.markerClusterGroup();
            var findNearbyMarkers = [];
            for(var i=0; i<data5[0]['data'].length; i++) {
                findNearbyMarkers.push(L.marker([data5[0]['data'][i].lat, data5[0]['data'][i].lng], {icon: findNearby}).bindPopup(data5[0]['data'][i].title + '<br><details><summery></summery><p>' + data5[0]['data'][i].summary + '</p><a target="_blank" href="' + data5[0]['data'][i].wikipediaUrl + '">' + '<p>Wikipedia</p></a></details>'));
            }
            for(var i=0; i< data5[0]['data'].length; i++) {
                findNearbyCluster.addLayer(findNearbyMarkers[i]);
            };
            L.easyButton({
                states: [{
                stateName: 'Info',
                icon: 'fa-eye',
                title: 'Add Interesting Info',
                onClick: function(control) {
                    map.addLayer(findNearbyCluster);
                    control.state('remove-markers');
                }
                }, {
                icon: 'fa-undo',
                stateName: 'remove-markers',
                title: 'Remove Interesting Info',
                onClick: function(control) {
                    map.removeLayer(findNearbyCluster);
                    control.state('Info');
                }
                }]
            }).addTo(map);
        
 }).fail(error);
};
 

/**
 FUNCTIONAL FUNCTIONS
*/

//onclick function
$('#searchButton').click(function () {
   update();
});


//ONLOAD FUNCTIONS
$(window).on('load',function() {
    var getFeatures = fetchData(
        {}, './libs/json/countryBorders.geo.json'
    );
    getFeatures.done(function(data) {
            for(var i = 0; i < data.features.length; i++) {
                    var option = '';
                    details.features.push(data.features[i]);
                    var iso_a2 = data.features[i].properties.iso_a2;
                    var name = data.features[i].properties.name
                    option += '<option value="'+ iso_a2 + '">' + name + '</option>';      
                    $('#items').append(option);
                }
    });

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
                        //call the functional functions with the rest of the api call
                        update();
            })
           
        });
    } else {
        alert('Please, enable the location');
    }

});
