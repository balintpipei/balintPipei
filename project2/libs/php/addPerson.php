<?php

	// example use from browser
	// http://localhost/companydirectory/libs/php/insertDepartment.php?name=New%20Department&locationID=1

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
//ADDED IN STUFF STARTS HERe

	$q = 'SELECT * from personnel where firstName= "' . $_POST['firstName'] . '" AND lastName = "' . $_POST['lastName'] . '"';
	$result = $conn->query($q);
	$id = $conn->insert_id;

	if(mysqli_num_rows($result) > 0)
	{
		$output['status']['code'] = "202";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "user exists";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	}
	else {
		$query = 'INSERT INTO personnel (firstName, lastName, email, departmentID) VALUES("' . $_POST['firstName'] . '","' . $_POST["lastName"] . '", "' . $_POST["email"] . '", ' . $_POST["department"] . ')';
		$result = $conn->query($query);
		$id = $conn->insert_id;
	
		
		if (!$result) {
	
			$output['status']['code'] = "400";
			$output['status']['name'] = "executed";
			$output['status']['description'] = "query failed";	
			$output['data'] = [];
	
			mysqli_close($conn);
	
			echo json_encode($output); 
	
			exit;
	
		}
	
		$output['status']['code'] = "200";
		$output['status']['name'] = "ok";
		$output['status']['description'] = "success";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [$id];
	}

	mysqli_close($conn);

	echo json_encode($output); 

?>