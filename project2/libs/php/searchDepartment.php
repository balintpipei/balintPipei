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
	

	$search = $_POST['search'];
	
	$search = "%".$search."%";

	$stmt = $conn->prepare('SELECT d.id as departmentID, d.name as departmentName, l.id as locationID, l.name as location FROM department d LEFT JOIN location l ON (l.id = d.locationID) WHERE d.name LIKE ? OR l.name LIKE ? ORDER BY d.name');
	$stmt->bind_param("ss", $search, $search);
	$stmt->execute();

	$result = $stmt->get_result();
   
   	$data = [];

	while ($row = mysqli_fetch_assoc($result)) {

		array_push($data, $row);

	}

	usort($data, function ($item1, $item2) {
        return $item1['departmentName'] <=> $item2['departmentName'];
    });

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $data;
	
	mysqli_close($conn);

	echo json_encode($output); 

?>