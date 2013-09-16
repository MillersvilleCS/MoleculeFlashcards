<?
	$request_structures["help"] = array();

	function handle_help_request($request_object){
		global $request_structures;

		$response_object = array();
		$response_object["success"] = true;

		ob_start();
		var_dump($request_structures);
		$response_object["output"] = ob_get_clean();

		return $response_object;
	}
?>
