<?php

	//request_structure
	$request_structures["get_flashcard_avail_games"] = array();
	$request_structures["get_flashcard_avail_games"]["request_type"] = "";
	$request_structures["get_flashcard_avail_games"]["authenticator"] = "";
	
	function handle_get_avail_flashcard_games_request($request_object){
		global $mysqli_gamedb;
		$response_object = array();

		$response_object['success'] = "true";
		$response_object['available_games'] = Array();
		
		$result = $mysqli_gamedb->query("SELECT game_id,COUNT(*) FROM questions GROUP BY game_id;");
		$q_counts = Array();
		
		while($row = $result->fetch_array()){
			$q_counts[$row[0]] = $row[1];
		}
	
		$result = $mysqli_gamedb->query("Select * from game_template;");
	
		while($row = $result->fetch_array()){
			if($q_counts[$row["id"]]>0){
				$new_game = Array();
				$new_game["id"] = $row["id"];
				$new_game["q_count"] = $q_counts[$row["id"]];
				$new_game["image"] = $row["image"];
				$new_game["name"] = $row["name"];
				$new_game["description"] = $row["description"];
				$new_game["time_limit"] = $row["time_limit"];
				$new_game["high_scores"] = get_high_scores($row["id"]);
				
				$response_object['available_games'][] = $new_game;
			}			
		}
	
		return $response_object;	
	}

	function get_high_scores($game_id){
		global $mysqli_gamedb;
		$ret = array();
		$query = "SELECT score,username FROM `scores` WHERE `game_id`=".$game_id." ORDER BY score DESC LIMIT 10";
		
		$result = $mysqli_gamedb->query($query);
	
		$position = 1;
		while($row = $result->fetch_array()){
			$new_hs = array();
			$new_hs["rank"] = $position++;
			$new_hs["username"] = $row["username"];
			$new_hs["score"] = $row["score"];
			
			$ret[] = $new_hs;
		}
		
		return $ret;
	}

?>