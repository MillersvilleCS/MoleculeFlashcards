<?php
	//request_structure
	$request_structures["start_flashcard_game"] = array();
	$request_structures["start_flashcard_game"]["request_type"] = "";
	$request_structures["start_flashcard_game"]["authenticator"] = "";
	$request_structures["start_flashcard_game"]["game_id"] = "";
	
	function handle_load_flashcard_game_request($request_object){
		global $mysqli_gamedb;
		$response_object = array();

		$response_object['game_session_id'] = uniqid();
		$response_object['questions'] = Array();
		//$response_object['question_id'] = Array();

		$user = get_user($request_object["authenticator"]);
		$user_id = $user->id;
		
		store_game_session($user_id,$response_object['game_session_id'],$request_object['game_id']);
		
		$result = $mysqli_gamedb->query("Select * from questions where game_id=".$mysqli_gamedb->real_escape_string($request_object["game_id"]).";");
	
		$temp_array = array();
		
		while($row = $result->fetch_array()){
			array_push($temp_array,$row);
		}
	
		shuffle($temp_array);
	
		$id=1;
		
		foreach($temp_array as $row){
			$answers = explode("|", $row["answers"]);
			array_push($response_object['questions'], build_question($id,$row["text"],$answers,$row["pdb_file"]));
			store_mapping($response_object['game_session_id'],$row["question_id"],$id++);
		}

		$response_object['success'] = "true";
		
		return $response_object;
	}
	
	function store_mapping($session_id,$original_id,$mapped_id){
		global $mysqli_gamedb;
		$query = "INSERT INTO `exscitech_web`.`question_id_map` (`session_id`, `original_q_id`, `mapped_q_id`) VALUES ('".$session_id."', '".$original_id."', '".$mapped_id."');";
		$mysqli_gamedb->query($query);
	}
	
	function build_question($id,$q_text,$answers,$pdb_url){
		$ret = Array();
		
		$ret["id"] = $id;
		$ret["text"] = $q_text;
		$ret["pdb_url"] = $pdb_url;
		$ret["answers"] = Array();
		
		$i = 0;
		foreach($answers as $ans){
			$ret["answers"][] = Array("id"=>$i++,"text"=>$ans);
		}
		
		return $ret;
	}
	
	function store_game_session($user_id,$session_id,$game_id){
		global $mysqli_gamedb;
		
		$session_id = $mysqli_gamedb->real_escape_string($session_id);
		$user_id = $mysqli_gamedb->real_escape_string($user_id);
		
		$query = "INSERT INTO `exscitech_web`.`game_sessions` (`session_id`, `user_id`, `game_id`, `create_time`, `expire_time`) VALUES ('".$session_id."', '".$user_id."', '".$game_id."', NOW(), NOW()+3600);";
		$mysqli_gamedb->query($query);
	}

	function get_user($authenticator){
		$authenticator = BoincDb::escape_string($authenticator);
		
		$user = BoincUser::lookup("authenticator = \"".$authenticator."\"");
		
		return $user;
	}
?>