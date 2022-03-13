<?php
 
    // Echo all errors back to the screen of the browser so PHP can be debugged
    ini_set('display_errors', 'On');
    error_reporting(E_ALL);
    ini_set('memory_limit', '1024M');

    $executionStartTime = microtime(true);

    $countryData = json_decode(file_get_contents("../json/countryBorders.geo.json"), true);

    // Create an empty array to add data to
    $border = [];

    // Use a for each loop to go through each feature of the geoJson data and get the country name and ISO 3 code
    foreach ($countryData['features'] as $feature) {

         array_push($border, $feature); 
    };
    // Assign the output variable properties to relevant data
     $output['status']['code'] = "200";
     $output['status']['name'] = "ok";
     $output['status']['description'] = "success";
     $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
     $output['data'] = $border;
 
     header('Content-Type: application/json; charset=UTF-8');

    // Echo out all the useful data
     echo json_encode($output);

?>