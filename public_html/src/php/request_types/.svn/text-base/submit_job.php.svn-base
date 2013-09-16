<?php
	$request_structures["submit_job"] = array();
	$request_structures["submit_job"]["request_type"] = "";
	$request_structures["submit_job"]["authenticator"] = ""; 
	$request_structures["submit_job"]["session_id"] = ""; 
	$request_structures["submit_job"]["app_id"] = ""; 
	$request_structures["submit_job"]["job_parameters"] = ""; 

	function handle_submit_job_request($request_object){
		global $mysqli_gamedb;
		
		$parameters = array("ligand_id",
							"conformation_id",
							"protein_id",
							"rotation_x",
							"rotation_y",
							"rotation_z",
							"rotation_phi",
							"min_temp",
							"max_temp",
							"total_time",
							"heat_percent",
							"cool_percent");
							
		$query = "INSERT INTO job_parameters SET ";
		$first = true;

		foreach ($parameters as $parameter){
			if(array_key_exists($parameter,$request_object["job_parameters"])){
				if(is_numeric($request_object["job_parameters"][$parameter])){
					if($first){
						$first = false;
					}
					else{
						$query .= ",";
					}
					$value = $request_object["job_parameters"][$parameter];
					
					$query .= $mysqli_gamedb->real_escape_string($parameter);
					$query .= "=";
					$query .= $mysqli_gamedb->real_escape_string($value);	
				}
				else{
					return return_error($parameter." value ".$request_object["job_parameters"][$parameter]." is not a valid number");	
				}
			}
			else{
				return return_error("Incomplete job submission, missing ".$parameter );
			}
		}
		
		if(!$mysqli_gamedb->query($query)){
			return return_error("MySQL error: " . $mysqli_gamedb->error);
		}
		else{
			$response_object = array();
			$response_object["success"] = "true";
			$response_object["message"] = "Job submitted!";
			$response_object["parameter_count"] = count($parameters);	
			return $response_object;
		}		
	}
?>


