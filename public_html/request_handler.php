<?php
	/***********************
	 *     Request Handler *
	 ***********************
	 * This file is the entry point for all incoming requests for the ExSciTecH games
	 * It loads all of the request type handlers and calls the specific request type hander for the request
	 * 
	 */
	 
	require_once("./src/php/database.inc");

	//start with a null object
	$response_object = null;

	//start the request structures object, used to verify an incoming request
	$request_structures = array();


	//grab all of the requests handlers
	foreach (glob("./src/php/request_types/*.php") as $filename){
    	include $filename;
	}

	//if the response was already set we have a problem....
	if(!isset($response_object)){
		$post = file_get_contents('php://input');
		
		$request_object = json_decode( $post, true );
		
		if($request_object == NULL){
			$request_object = create_request_object($post);	
		}
		else{
			$json = true;
		}

	
		if(isset($request_object['request_type'])){
			//verify that the request has all of the required fields
			if(verify_request($request_object)){
			
				//var_dump($request_object);

				// Here we try and call the request handler
				$response_object = call_user_func("handle_".$request_object["request_type"]."_request", $request_object);

				// false means the handler doesn't exist
				if(!$response_object){
					//var_dump($request_object);
					$response_object = build_error_response("Invalid request type");
				}
				// null means the handler gave a bad response
				else if(!isset($response_object)){
					$response_object = build_error_response("Invalid handler action");
				}
			}
			else{
				$response_object = build_error_response("Invalid request structure");
			}
		}
		else{
			$response_object = build_error_response("Invalid request: " + $post);
		}

		$response_json = json_encode($response_object);

		if($json){
			echo $response_json;
		}
		else{
			//xml
			$xml = new SimpleXMLElement("<server_response></server_response>");
			array_to_xml($response_object,$xml);
		
			$dom = new DOMDocument();
			$dom->loadXML($xml->asXML());
			$dom->formatOutput = true;
			echo $dom->saveXML();

		}
	}

/*****************************************************
	function to send an error response
 *****************************************************/

	function build_error_response( $message ){
		$response = array();
		$response['success'] = "false";
		$response['error'] = $message;
		return $response;
	}

/************************************
	Some functions to parse xml and turn it into the standard object format we use
*************************************/

	function create_request_object($xml){
		$output_array = xml2array($xml);
		
		if($output_array["tag"]=="CLIENT_REQUEST"){
			$request_object = make_object($output_array);
			//var_dump($output_array);
		}
		else{
			return null;
		}
		return $request_object;
	}

	function make_object($array){
		$object = array();

		//echo count($array);
		//var_dump($array);

		if(count($array)==2){
			return $array["value"];
		}

		foreach($array as $index => $child){
			//if the child index is an integer (meaning it is a child XML element)
			if(is_int($index)){
				$new_index = $child["tag"];
				$object[strtolower($new_index)] = make_object($child);
			}
			else if($index =="attributes"){
				foreach($array[$index] as $key => $value){
					$object[strtolower($key)] = strtolower($value);
				}
			}
		}

		return $object;
	}
	

	function xml2array($xml){
		$opened = array();
		$opened[1] = 0;
		$xml_parser = xml_parser_create();
		xml_parse_into_struct($xml_parser, $xml, $xmlarray);
		$array = array_shift($xmlarray);
		unset($array["level"]);
		unset($array["type"]);
		$arrsize = sizeof($xmlarray);
		for($j=0;$j<$arrsize;$j++){
		    $val = $xmlarray[$j];
		    switch($val["type"]){
		        case "open":
		            $opened[$val["level"]]=0;
		        case "complete":
		            $index = "";
		            for($i = 1; $i < ($val["level"]); $i++)
		                $index .= "[" . $opened[$i] . "]";
		            $path = explode('][', substr($index, 1, -1));
		            $value = &$array;
		            foreach($path as $segment)
		                $value = &$value[$segment];
		            $value = $val;
		            unset($value["level"]);
		            unset($value["type"]);
		            if($val["type"] == "complete")
		                $opened[$val["level"]-1]++;
		        break;
		        case "close":
		            $opened[$val["level"]-1]++;
		            unset($opened[$val["level"]]);
		        break;
		    }
		}
		return $array;
	} 

	// function defination to convert array to xml
	function array_to_xml($data, &$xml) {
		foreach($data as $key => $value) {
		    if(is_array($value)) {
		        if(!is_numeric($key)){
		            $subnode = $xml->addChild("$key");
		            array_to_xml($value, $subnode);
		        }
		        else{
		            array_to_xml($value, $xml);
		        }
		    }
		    else {
		        $xml->addChild("$key","$value");
		    }
		}
	}


	//Verifies the request has the fields defined in $request_structures 
	function verify_request($request_object){
		global $request_structures;
		$structure = $request_structures[$request_object["request_type"]];

		return check_structure($structure,$request_object);
	}

	function check_structure($structure, $object){
		foreach($structure as $key => $node){

			if(!array_key_exists($key, $object)){
				return false;
			}

			if(is_array($node)){
				$valid = check_structure($node, $object[$key]);
				if(!$valid){
					return false;
				}
			}
		}
		return true;
	}

	/* Stuff */

	function return_error($error_message){
		$error_object = array();
		$error_object["success"] = "false";
		$error_object["error"] = $error_message;
		return $error_object;
	}

	/*
	 * query the package table and verify that the
	 * workunit name matches the user id. return true
	 * if it matches, and otherwise false
	 */
	function authenticate($user_id, $wu_name){
		global $mysqli_gamedb;
		if(!$mysqli_gamedb->query("hello")){
			echo "Error: " . $mysqli_gamedb->error;
		}
	}
?>
