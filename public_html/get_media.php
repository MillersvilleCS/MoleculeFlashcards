<?php
	/*
	 * get_media.php?gsi=1&qid=2&mt=1
	 * gsi - game_session_id
	 * qid - question_id
	 * mt - media_type
	 */
	 
	require_once("./src/php/database.inc");
	
	if( isset($_GET["gsi"]) && isset($_GET["mt"]) && isset($_GET["qid"]) ){
		$game_session_id = $_GET["gsi"];
		$question_id = $_GET["qid"];
		$media_type = $_GET["mt"];
		
		if($media_type==0){
			$mt_str = "pdb_file";
		}
		else{
			$mt_str = "image_file";
		}
		
		$game_session_id = $mysqli_gamedb->real_escape_string($game_session_id);
		$question_id = $mysqli_gamedb->real_escape_string($question_id);
		$mt_str = $mysqli_gamedb->real_escape_string($mt_str);
		
		$query = "SELECT ".$mt_str." FROM questions WHERE game_id=(SELECT game_id FROM game_sessions WHERE session_id=\"".$game_session_id."\") AND question_id=(SELECT `original_q_id` FROM  `question_id_map` WHERE  `session_id` =  \"".$game_session_id."\" AND  `mapped_q_id` =".$question_id.")";
		$result = $mysqli_gamedb->query($query);
		
		$row = $result->fetch_array();
		if($row){
			$filename = $row[0];
		}
		else{
			exit;
		}
		
		$file = fopen($filename, 'rb');
		
		// send the right headers
		if($media_type==0){
			header("Content-Type: application/vnd.palm");
		}
		else{
			header("Content-Type: image/png");
		}
		
		header("Content-Length: " . filesize($filename));
		
		// dump the file and stop the script
		fpassthru($file);
		
		//http_response_code(200);
		exit;
		
	}