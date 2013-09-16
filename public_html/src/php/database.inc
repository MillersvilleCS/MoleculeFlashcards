<?php

	//Database connection parameters
	$SERVER = "localhost";
	$USER = "exscitech";
	$PASSWORD = "test!!exscitech";
	$DB = "exscitech_web";


	// The mysql connection is global just to make things easier
	$mysqli_gamedb = connect_to_mysql();

	// If there is an error connecting to the mysql database return an error
	if ($mysqli_gamedb->connect_errno) {
		$response_object = return_error("Failed to connect to MySQL: (" . $mysqli_gamedb->connect_errno . ") " . $mysqli_gamedb->connect_error);
	}
	
	function connect_to_mysql(){
		global $SERVER;
		global $USER;
		global $PASSWORD;
		global $DB;

		$mysqli = new mysqli($SERVER, $USER, $PASSWORD, $DB);
		return $mysqli;
	}
	
?>