<?php

    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    $executionStartTime = microtime(true);

    $urlpostalcodes='http://api.geonames.org/postalCodeSearchJSON?formatted=true&postalcode=' . $_REQUEST['postalcode'] . '&maxRows=5&username=balint1120&style=full';

    $chpostalcodes = curl_init();
    curl_setopt($chpostalcodes, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($chpostalcodes, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($chpostalcodes, CURLOPT_URL, $urlpostalcodes);

    $resultpostalcodes = curl_exec($chpostalcodes);

    curl_close($chpostalcodes);

    $decodpostalcodes = json_decode($resultpostalcodes, true);

    $outputpostalcodes['status']['code'] = '200';
    $outputpostalcodes['status']['name'] = 'ok';
    $outputpostalcodes['status']['description'] = 'success';
    $outputpostalcodes['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . ' ms';
    $outputpostalcodes['data'] = $decodpostalcodes['postalCodes'];

        
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($outputpostalcodes);

?>