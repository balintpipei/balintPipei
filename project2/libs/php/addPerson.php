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
	$firstName = $_POST['firstName'];
	$lastName = $_POST['lastName'];
	$email = $_POST['email'];
	$jobTitle = $_POST['jobTitle'];
	$department = $_POST['department'];


	$stmt = $conn->prepare('SELECT firstName, lastName from personnel where firstName= ? AND lastName = ?');
	$stmt->bind_param("si", $firstName, $lastName);
	$stmt->execute();

	$result = $stmt->get_result();

	if(mysqli_num_rows($result) > 0)
	{
		$output['status']['code'] = "202";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "user exists";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	}
	else {

		$statement = $conn->prepare('INSERT INTO personnel (firstName, lastName, email, jobTitle, departmentID) VALUES(?,?,?,?,?)');
		$statement->bind_param("ssssi", $firstName, $lastName, $email, $jobTitle, $department);
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