$(window).on('load', function() {
    if($('#preloader').length) {
        $('#preloader').delay(1000).fadeOut('slow', function() {
            $(this).remove();
        });
    }
});

//earthquake api calls result

$('#earthquakeButton').click(function() {

    $.ajax({
        url: '/itcareerswitch/task/libs/php/earthquake.php',
        type: 'POST',
        dataType: 'json',
        data: {
            north: $('#north').val(),
            south: $('#south').val(),
            east: $('#east').val(),
            west: $('#west').val()
        },
        //loading message until the result arrive from api call

        beforeSend: function() {
            $('#loader').removeClass('hidden')
        },

        success: function(result) {
            console.log(result);

            if(result.status.name == 'ok') {

                if(result.data.length != 0) {

                    $('#first').html('');
                    $('#second').html('');
                    $('#third').html('');
                    $('#fourth').html('');

                    let earthquakeResult = [];
                        $.each(result.data, function(_, data) {
                            earthquakeResult.push(`<div class='resultbox'>
                                                        <p>DateTime: ${data.datetime}</p>
                                                        <p>Depth: ${data.depth}"</p>
                                                        <p>Magnitude: ${data.magnitude}</p>
                                                        <p>Eqid: ${data.eqid}</p>
                                                    </div>`);
                    });

                     //all of the result appear on the screen
                    $("#all").html(earthquakeResult)
                } else {

                    $('#all').html('There is no result with these details, try another');
                    $('#first').html('');
                    $('#second').html('');
                    $('#third').html('');
                    $('#fourth').html('');
                }
            }
        },
        complete: function() {
            $('#loader').addClass('hidden')
        },
        error: function(jqXHR, textStatus, errorThrown) {
            var errorMessage = jqXHR.status + ': ' + jqXHR.statusText
            alert('Error - ' + errorMessage);
        }
    });
});

//second api calls
$('#postalCodeButton').click(function() {

    $.ajax({
        url: '/itcareerswitch/task/libs/php/postalCode.php',
        type: 'POST',
        dataType: 'json',
        data: {
            postalcode: $('#postalcode').val()
        },
        beforeSend: function() {
            $('#loader').removeClass('hidden')
        },
        success: function(result) {
            console.log(result);

            if(result.status.name == 'ok') {

                if(result.data.length != 0) {

                    $('#first').html('');
                    $('#second').html('');
                    $('#third').html('');
                    $('#fourth').html('');

                    let postalCodeResult = [];
                        $.each(result.data, function(_, data) {
                             postalCodeResult.push(`<div class='resultbox'>
                                                        <p>CountryCode: ${data.countryCode}</p>
                                                        <p>Lng: ${data.lng}"</p>
                                                        <p>AdminName1: ${data.adminName1}</p>
                                                        <p>Lat: ${data.lat}</p>
                                                    </div>`);
                        });
                //you can choose any simpathic element from the array
                $("#all").html(postalCodeResult[0])
                } else {
                    $('#all').html('There is no result with these details, try another');
                    $('#first').html('');
                    $('#second').html('');
                    $('#third').html('');
                    $('#fourth').html('');
                }
            }
        },
        complete: function() {
            $('#loader').addClass('hidden')
        },
        error: function(jqXHR, textStatus, errorThrown) {
            var errorMessage = jqXHR.status + ': ' + jqXHR.statusText
            alert('Error - ' + errorMessage);
        }
    });
});

//third api calls

$('#countryCodeButton').click(function() {

    $.ajax({
        url: '/itcareerswitch/task/libs/php/countryCode.php',
        type: 'POST',
        dataType: 'json',
        data: {
            lng: $('#countryCodeLng').val(),
            lat: $('#countryCodeLat').val(),
        },
        beforeSend: function() {
            $('#loader').removeClass('hidden')
        },
        success: function(result) {
            console.log(result);

            if(result.status.name == 'ok') {

                if(result.data.status) {
                    $('#all').html('There is no result with these details, try another');
                } else {
                    $('#all').html('');
                    $('#first').html('Languages: ' + result.data.languages); 
                    $('#second').html('Distance: ' + result.data.distance);
                    $('#third').html('CountryCode: ' + result.data.countryCode);
                    $('#fourth').html('CountryName: ' + result.data.countryName)
                }
            }
        },
        complete: function() {
            $('#loader').addClass('hidden')
        },
        error: function(jqXHR, textStatus, errorThrown) {
            var errorMessage = jqXHR.status + ': ' + jqXHR.statusText
            alert('Error - ' + errorMessage);
        }
    });
});