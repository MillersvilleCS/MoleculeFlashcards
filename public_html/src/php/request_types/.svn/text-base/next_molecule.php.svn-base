<?php
	/* Example Request:
	 * <client_request>
	 *   <userid>15</userid>
	 *   <request_type>next_molecule</request_type>
	 *   <wu_name>lg1c1_345</wu_name>
	 *   <pdb_name>first_name.pdb</pdb_name>
	 *   <answer>2</answer>
	 * 	 <time>100<time> <!-- in ms -->
	 * </client_request>
	 * 
	 * Example response:
	 *	<server_reply>
	 *		<wu_name>lg1c1_345<wu_name>
	 *		<correct_answer file="first_name.pdb">no</correct_answer>
	 *		<text_display>Here is a link to the wikipedia article</text_display>
	 *		<image_display>lg1c1_345_jpgs_21_hints.jpg</image_display>
	 *		<score>748</score>
	 *		<pdb_name>next_name.pdb</pdb_name>
	 *		<hints>
	 *			<hint>
	 *				<time>75</time>
	 *				<text>hint hint hint</text>
	 *			</hint>
	 *			<hint>
	 *				<time>50</time>
	 *				<text>hint hint hint hint</text>
	 *			</hint>
	 *		</hints>
	 *	</server_reply> 
	 */

	//request_structure
	$request_structures["next_molecule"] = array();
	$request_structures["next_molecule"]["request_type"] = "";
	$request_structures["next_molecule"]["userid"] = "";
	$request_structures["next_molecule"]["wu_name"] = "";
	$request_structures["next_molecule"]["pdb_name"] = "";
	$request_structures["next_molecule"]["answer"] = "";
	$request_structures["next_molecule"]["time"] = "";
		
	//handler
	function handle_next_molecule_request($request_object){
		global $mysqli_gamedb;

		$user_id = $request_object["userid"];
		$wu_name = $request_object["wu_name"];
		$pdb_name = $request_object["pdb_name"];
		$answer = $request_object["answer"];
		$time = $request_object["time"];

		$response_object = array();

		// Main stuff
		echo "THIS IS A WORK IN PROGRESS....\n"; //TODO TODO TODO
		
		$info = get_molecule_info($wu_name, $pdb_name);		//OK

		if($answer == $info["correct_answer"])
			$answer_validity = "true";
		else
			$answer_validity = "false";
		$response_object["correct_answer"] = $answer_validity;

		//update answer updates the entry we made when we sent the question out
		update_answer($answer,$question_id, $answer_validity);										//TODO
		$response_object["score"] = update_score($answer_validity, $user_id);						//OK - TODO error checking/handling/more through testing

		$response_object["next_pdb_name"] = get_next_molecule($info["question_id"],$user_id); 		//OK - TODO error checking/handling/more through testing

		$response_object["image_display"] = get_molecule_image($response_object["next_pdb_name"]); 	//OK - TODO error checking/handling/more through testing
		
		$response_object["hints"] = get_hints($pdb_name); 											//TODO
		$response_object["success"] = "true";

		return $response_object;
	}


	/************************
	 *	HELPER FUNCTIONS	*
	 ************************/


    /********************
	 *	get_pdb_name()	*
	 ********************
	 * This is where we define the logic for the next question. In it's current implementation
	 * the game randomly selects a question that hasn't been seen before. Then, once all of the
	 * questions have been viewed, the questions that were shown previously but were answered
	 * incorrectly are shown a second time.
	 */
	function get_next_molecule($question_id,$user_id){
		global $mysqli_gamedb;

		$query = "SELECT * FROM Gamequestions WHERE idpackage=(SELECT idpackage FROM Gamequestions WHERE id=".$question_id.")";

		$questions = array();

		if($result = $mysqli_gamedb->query($query)){
			while($array = $result->fetch_assoc()){
				$questions[] = $array;
			}
			$result->close();

			$good_questions = array();
			
			foreach($questions as $question){
				if($question["answerstatus"] == 'empty'){
					$good_questions[] = $question;
				}
			}
			if(!count($good_questions)){
				foreach($questions as $question){
					if($question["answerstatus"] == 'wrong'){
						$good_questions[] = $question;
					}
				}
			}
			
			if(count($good_questions)>0){
				$index = rand(0,count($good_questions)-1);
				//var_dump($good_questions[$index]);
				store_new_answer($good_questions[$index]["id"], $user_id);
				return get_pdb_name($good_questions[$index]["idmolecule"]);
			}
			else{
				return null;
			}
		}
		else{
			return null;
		}
	}

    /************************
	 *	store_new_answer()	*
	 ************************/
	function store_new_answer($question_id,$user_id){
		global $mysqli_gamedb;

		$query = ("INSERT INTO Answers ( idcontent, user_id)
				        VALUES (".$question_id.",".$user_id.")");
		if($mysqli_gamedb->query($query)){

		}else{
			echo $query."\n";
		}
		
	}


    /****************
	 *	get_hints()	*
	 ****************/

	function get_hints($pdb_name){
		$hints_array = array();
		
		

		return $hints_array;
	}

    /********************
	 *	get_pdb_name()	*
	 ********************/
	function get_pdb_name($molecule_id){
		global $mysqli_gamedb;

		$query = "SELECT file FROM Molecule WHERE id=".$molecule_id;

		if($result = $mysqli_gamedb->query($query)){		
			$array = $result->fetch_assoc();
			$result->close();
			return $array["file"];
		}
		else{
			return "nonsense";
		}
		
	}

    /************************
	 *	get_molecule_info()	*
	 ************************/
	function get_molecule_info($wu_name, $pdb_name){
		global $mysqli_gamedb;
		$info = array();

		$query = "SELECT * FROM Gamequestions WHERE
				idpackage  = (SELECT id FROM Game WHERE wuname=\"".$wu_name."\") AND 
				idmolecule = (SELECT id FROM Molecule WHERE file=\"".$pdb_name."\")";

		if($result = $mysqli_gamedb->query($query)){		
			$array = $result->fetch_assoc();
			$result->close();

			$info["correct_answer"] = $array["answer"];
			$info["question_id"] = $array["id"];

			return $info;
		}
	}

    /********************
	 *	update_answer()	*
	 ********************
     * sends a query to update the answers table entry and update the
     * correspoinding entry in the package contents table
     */
	function update_answer($answer, $question_id, $answer_validity){
		#Query 1 update the answers table entry
		$query1 = "UPDATE Answers SET 
					useranswer=".$answer.",
					receivedtime=NOW() WHERE
					idcontent=".$question_id." AND
					useranswer IS NULL";
		#Query 2
		$query2 = "UPDATE Gamequestions SET
					answerstatus="." WHERE
					id=".$question_id;
	}

    /********************
	 *	update_score()	*
	 ********************
     * Select the score and level fields from the user table.
     * Find the new score based on the user's level and whether they got
     * the question right. Update their score accordingly.
     */
	function update_score($answer_validity, $user_id){
		global $mysqli_gamedb;

		$query_query  = "SELECT score, level FROM User WHERE id=".$user_id;

		if($result = $mysqli_gamedb->query($query_query)){
			$array = $result->fetch_assoc();
			$result->close();
		}

		$score = $array["score"];
		$level = $array["level"];

		$update_query = "UPDATE User SET score=".$score." WHERE id=".$user_id;

		if(!$mysqli_gamedb->query($update_query)){
			//TODO
		}

		if(!$score)
			return 10;
		return $score;
	}

    /****************************
	 *	get_molecule_image()	*
	 ****************************/
	function get_molecule_image($pdb_name){
		global $mysqli_gamedb;
		$query = "SELECT image from Molecule where file=\"".$pdb_name."\"";

		if($result = $mysqli_gamedb->query($query)){
			$array = $result->fetch_assoc();
			$result->close();
			return $array["image"];
		}
		else{
			echo "something else";
		}
		
	}

?>
