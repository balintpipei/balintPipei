<?php

    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    $executionStartTime = microtime(true);

    $url='https://api.openweathermap.org/data/2.5/onecall?lat=' . $_REQUEST['lat'] .'&lon=' . $_REQUEST['lon'] . '&units=metric&exclude=minutely,alerts&appid=21404b1bd7f3b3d026b3df3f86a75683';

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, $url);

    $result = curl_exec($ch);

    curl_close($ch);

    $decod = json_decode($result, true);

    $output['status']['code'] = '200';
    $output['status']['name'] = 'ok';
    $output['status']['description'] = 'success';
    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . ' ms';
    $output['data'] = $decod;


    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($output);

?>      