<?
	$request_structures["get_high_scores"] = array();
	$request_structures["get_high_scores"]["request_type"] = "";
	$request_structures["get_high_scores"]["game_id"] = "";
	$request_structures["get_high_scores"]["starting_rank"] = "";
	$request_structures["get_high_scores"]["range"] = "";
		
	function handle_get_high_scores_request($request_object){
		global $mysqli_gamedb;
		$response_object = array();
	
		$game_id = $mysqli_gamedb->real_escape_string($request_object["game_id"]);
		$start = $mysqli_gamedb->real_escape_string($request_object["starting_rank"]);
		$range = $mysqli_gamedb->real_escape_string($request_object["range"]);
	
		$query = "SELECT * FROM `scores` where game_id = ". $game_id ." ORDER BY score DESC LIMIT ". ($start-1) .",". $range;
	
		$result = $mysqli_gamedb->query($query);
	
		$response_object["scores"] = array();
		
		$rank = $start;
		
		while($row = $result->fetch_array()){
			$score = array();
			$score["rank"] = $rank++;
			$score["score"] = $row["score"];
			$score["username"] = $row["username"];
		
			$response_object["scores"][] = $score;
		}
	
		$response_object["success"] = "true";
	
		return $response_object;
	}
	
	?>