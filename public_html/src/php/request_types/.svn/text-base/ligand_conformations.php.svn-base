<?
	$request_structures["ligand_conformations"] = array();
	$request_structures["ligand_conformations"]["request_type"] = "";
	$request_structures["ligand_conformations"]["authenticator"]= "";
	$request_structures["ligand_conformations"]["session_id"] = "";

	$NUM_ADDITIONAL_LIGANDS = 5;

	function handle_ligand_conformations_request($request_object){
		global $mysqli_gamedb;
		global $NUM_ADDITIONAL_LIGANDS;

		$response_object = array();
		$response_object["success"] = "true";

		$response_object["ligand_list"] = get_ligands($NUM_ADDITIONAL_LIGANDS);

		return $response_object;
	}

	function new_conformation($id, $name, $link){
		return array(
					"id" => $id,
					"name" => $name,
					"pdb_link" => $link
				);
		
	}

?>
