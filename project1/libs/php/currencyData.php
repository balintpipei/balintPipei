<?php
 
    ini_set('display_errors', 'On');
    error_reporting(E_ALL);
    ini_set('memory_limit', '1024M');

    $executionStartTime = microtime(true);

    $currencyData = json_decode(file_get_contents("../json/currency-symbols.json"), true);

     $output['status']['code'] = "200";
     $output['status']['name'] = "ok";
     $output['status']['description'] = "success";
     $output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
     $output['data'] = $currencyData;
 
     header('Content-Type: application/json; charset=UTF-8');

    // Echo out all the useful data
     echo json_encode($output);

?>