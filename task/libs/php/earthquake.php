<?php

    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    $executionStartTime = microtime(true);

    $urlearthquakes='http://api.geonames.org/earthquakesJSON?formatted=true&north=' . $_REQUEST['north'] . '&south=' . $_REQUEST['south'] . '&east='. $_REQUEST['east'] . '&west='. $_REQUEST['west'] . '&username=<username>&style=full';

    $chearthquakes = curl_init();
    curl_setopt($chearthquakes, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($chearthquakes, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($chearthquakes, CURLOPT_URL, $urlearthquakes);

    $resultearthqueakes = curl_exec($chearthquakes);

    curl_close($chearthquakes);

    $decodeearthquakes = json_decode($resultearthqueakes, true);

    $outputearthquakes['status']['code'] = '200';
    $outputearthquakes['status']['name'] = 'ok';
    $outputearthquakes['status']['description'] = 'success';
    $outputearthquakes['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . ' ms';
    $outputearthquakes['data'] = $decodeearthquakes['earthquakes'];


    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($outputearthquakes);

?>      
