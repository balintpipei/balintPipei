<?php

	// example use from browser
	// http://localhost/companydirectory/libs/php/insertDepartment.php?name=New%20Department&locationID=<id>

	// remove next two lines for production
	
	//ini_set('display_errors', 'On');
	//error_reporting(E_ALL);

	$executionStartTime = microtime(true);
	
	include("config.php");

	header('Content-Type: application/json; charset=UTF-8');

	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

	if (mysqli_connect_errno()) {
		
		$output['status']['code'] = "300";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "database unavailable";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output);

		exit;

	}	

	// SQL statement accepts parameters and so is prepared to avoid SQL injection.
	// $_REQUEST used for development / debugging. Remember to change to $_POST for production

//ADDED IN department STARTS HERe
$name = $_POST['name'];
$locationID = $_POST['locationID'];


$stmt = $conn->prepare('SELECT name from department where name= ?');
$stmt->bind_param("s", $name);
$stmt->execute();

$result = $stmt->get_result();


if(mysqli_num_rows($result) > 0)
{
	$output['status']['code'] = "202";
	$output['status']['name'] = "executed";
	$output['status']['description'] = "department exists";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
}
	else {	
		$statement = $conn->prepare('INSERT INTO department (name, locationID) VALUES(?,?)');
		$statement->bind_param("si", $name, $locationID);
		$statement->execute();

		$id = $conn->insert_id;

		$output['status']['code'] = "200";
		$output['status']['name'] = "ok";
		$output['status']['description'] = "success";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [$id];
	}


	mysqli_close($conn);

	echo json_encode($output); 

?>