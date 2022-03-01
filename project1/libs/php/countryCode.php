<?php

    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    $executionStartTime = microtime(true);

    $urlcountrycodes='http://api.geonames.org/countryCodeJSON?formatted=true&lat=' . $_REQUEST['lat'] . '&lng=' . $_REQUEST['lng'] . '&username=balint1120&style=full';

    $chcountrycodes = curl_init();
    curl_setopt($chcountrycodes, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($chcountrycodes, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($chcountrycodes, CURLOPT_URL, $urlcountrycodes);

    $resultcountrycodes = curl_exec($chcountrycodes);

    curl_close($chcountrycodes);

    $decodcountrycodes= json_decode($resultcountrycodes, true);

    $outputcountrycodes['status']['code'] = '200';
    $outputcountrycodes['status']['name'] = 'ok';
    $outputcountrycodes['status']['description'] = 'success';
    $outputcountrycodes['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . ' ms';
    $outputcountrycodes['data'] = $decodcountrycodes;

        
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($outputcountrycodes);

?>