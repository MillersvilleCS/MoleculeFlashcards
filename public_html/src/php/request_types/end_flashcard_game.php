<?php
	//request_structure
	$request_structures["end_flashcard_game"] = array();
	$request_structures["end_flashcard_game"]["request_type"] = "";
	$request_structures["end_flashcard_game"]["authenticator"] = "";
	$request_structures["end_flashcard_game"]["game_session_id"] = "";
	$request_structures["end_flashcard_game"]["game_time"] = "";
	
	function handle_end_flashcard_game_request($request_object){
		global $mysqli_gamedb;
		$response_object = array();
		
		$user = get_user($request_object["authenticator"]);
		
		$game_session_id = $mysqli_gamedb->real_escape_string($request_object["game_session_id"]);
		$max_time = get_time_limit($game_session_id);
		
		$remaining_time = $max_time - $mysqli_gamedb->real_escape_string($request_object["game_time"]);
		
		//calculate base score
		$base_score = calculate_score($game_session_id);
		
		//calculate final score
		$final_score = (int) ( $base_score + $remaining_time/500 );
		
		//if the player finished the game 
		// ie if num_questions_answered == num_questions or time == time_limit 		
		if(are_all_questions_answered($game_session_id) || $remaining_time == $max_time){
			//store score
			store_score($user, $game_session_id,$final_score);
		
			//return score rank
			$response_object["rank"] = get_rank($final_score, $game_session_id);
			
			$response_object["final_score"] = $final_score;
			
		}
		//else purge the game session from the database
		else{
			
		}
		
		$response_object["success"] = "true";
		
		return $response_object;
	}
	
	function are_all_questions_answered($game_session_id){
		global $mysqli_gamedb;
		$query = "SELECT COUNT(*)  FROM `answers` WHERE `game_session_id` = '".$game_session_id."' AND `correct`= 1";
		
		$result = $mysqli_gamedb->query($query);
		
		while($row = $result->fetch_array()){
			$answered = $row[0];
		}
		
		$query = "SELECT COUNT(*) FROM `questions` WHERE game_id=(SELECT game_id  FROM `answers` WHERE `game_session_id` = '".$game_session_id."' LIMIT 1)";
		
		$result = $mysqli_gamedb->query($query);
		
		while($row = $result->fetch_array()){
			$total = $row[0];
		}
		
		return ( $answered == $total );
	}
	
	function store_score($user, $game_session_id,$final_score){
		global $mysqli_gamedb;
		
		$query = "INSERT INTO `exscitech_web`.`scores` (
					`score`,
					`game_id`,
					`user_id`,
					`username`,
					`time`)
				VALUES (
					'".$final_score."',
					(SELECT game_id  FROM `game_sessions` WHERE `session_id` = '".$game_session_id."'),
					'".$user->id."',
					'".$user->name."',
					NOW());";
		$result = $mysqli_gamedb->query($query);
	}
	
	function get_rank($score, $game_session_id){
		global $mysqli_gamedb;
		$query = "SELECT COUNT(*) FROM `scores` WHERE `score` > '".$score."' AND `game_id`=(SELECT game_id  FROM `answers` WHERE `game_session_id` = '".$game_session_id."' LIMIT 1)";
		
		$result = $mysqli_gamedb->query($query);
		
		if($row = $result->fetch_array()){
			$rank = $row[0] + 1;
		}
		else{
			$rank = null;
		}
		
		return $rank;
	}
	
	function get_time_limit($game_session_id){
		global $mysqli_gamedb;
		$query = "SELECT time_limit FROM `game_template` WHERE `id` = (SELECT game_id  FROM `answers` WHERE `game_session_id` = '".$game_session_id."' LIMIT 1)";
		
		$result = $mysqli_gamedb->query($query);
		
		if($row = $result->fetch_array()){
			return $row[0];
		}
		else{
			return 0;
		}
	}
	
?>