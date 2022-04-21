<?php
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

	// SQL does not accept parameters and so is not prepared

	$filterLocation = $_POST['locFilter'];
	$filterDepartment = $_POST['depFilter'];

	$query = 'SELECT p.lastName, p.firstName as name, p.jobTitle, p.email, p.id, d.id as departmentId, d.name as department, l.name as location FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) ';

	if(strlen($filterDepartment) > 4 && strlen($filterLocation) > 4) {
		$query .= ' WHERE d.name IN ' . $filterDepartment . ' AND l.name IN ' . $filterLocation . '';
	} elseif ( strlen($filterDepartment) > 4 ) {
		$query .= ' WHERE d.name IN ' . $filterDepartment . '';
	} elseif( strlen($filterLocation) > 4) {
		$query .= ' WHERE l.name IN ' . $filterLocation . '';
	};

	$result = $conn->query($query);
	
	if (!$result) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

	}
   
   	$data = [];

	while ($row = mysqli_fetch_assoc($result)) {

		array_push($data, $row);

	}
	usort($data, function ($item1, $item2) {
        return $item1['name'] <=> $item2['name'];
    });


	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $data;
	
	mysqli_close($conn);

	echo json_encode($output); 

?>