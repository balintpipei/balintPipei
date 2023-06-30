<?php
    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    $executionStartTime = microtime(true);

    $ch = curl_init();

    curl_setopt_array($ch, [
	CURLOPT_URL => "https://wft-geo-db.p.rapidapi.com/v1/geo/countries/" . $_REQUEST['iso'],
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_FOLLOWLOCATION => true,
	CURLOPT_ENCODING => "",
	CURLOPT_MAXREDIRS => 10,
	CURLOPT_TIMEOUT => 30,
	CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
	CURLOPT_CUSTOMREQUEST => "GET",
	CURLOPT_HTTPHEADER => [
		"x-rapidapi-host: <host>",
		"x-rapidapi-key: <key>"
	],
]);

$result = curl_exec($ch);

curl_close($ch);

$decode = json_decode($result, true);

$output['status']['code'] = '200';
$output['status']['name'] = 'ok';
$output['status']['description'] = 'success';
$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . ' ms';
$output['data'] = $decode;


header('Content-Type: application/json; charset=UTF-8');
echo json_encode($output);
