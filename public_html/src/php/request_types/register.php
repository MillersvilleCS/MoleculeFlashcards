<?php
	//request_structure
	$request_structures["register"] = array();
	$request_structures["register"]["request_type"] = "";
	$request_structures["register"]["username"] = "";
	$request_structures["register"]["password"] = "";
	$request_structures["register"]["email"] = "";
	
	include_once("/boinc/exscitech/boinc/html/inc/boinc_db.inc");
	include_once("/boinc/exscitech/boinc/html/inc/util.inc");
	include_once("/boinc/exscitech/boinc/html/inc/email.inc");
	include_once("/boinc/exscitech/boinc/html/inc/user.inc");
	include_once("/boinc/exscitech/boinc/html/inc/recaptchalib.php");
	
	function handle_register_request($request_object){
		$response_object = array();
		
		// Grab request fields
		$username = BoincDb::escape_string($request_object["username"]);
		$email_addr = BoincDb::escape_string($request_object["email"]);	
		$passwd = BoincDb::escape_string($request_object["password"]);	
		
		//Check if account creation is enabled
		$config = get_config();
		if( parse_bool($config, "disable_account_creation") ||
		    parse_bool($config, "no_web_account_creation") ) {
			    return build_error_response( "Account Creation Disabled" );
		}
		
		//Check to see if email address is in use
		$email_addr = strtolower($email_addr);
		if (!is_valid_email_addr($email_addr)) {
			return build_error_response( "Invalid email address: you must enter a valid address of the form name@domain" );
		}
		$user = lookup_user_email_addr($email_addr);
		if ($user) {
			return build_error_response( "There's already an account associated with that email address.");
		}
		
		
		//Check to see if the username is in use
		$user = get_user_from_name($username);
		if ($user) {
			return build_error_response( "There's already an account with that username.");
		}
		if (strlen($username)==0) {
			return build_error_response( "You must supply a name for your account" );
		}
		if ($username != sanitize_tags($username)) {
			return build_error_response( "HTML tags not allowed in username" );
		}
		
		//Calculate password hash
		$min_passwd_length = parse_config($config, "<min_passwd_length>");
		if (!$min_passwd_length) $min_passwd_length = 6;

		if (!is_ascii($passwd)) {
			return build_error_response( "Passwords may only include ASCII characters." );
		}

		if (strlen($passwd)<$min_passwd_length) {
        	return build_error_response( "New password is too short: minimum password length is ".$min_passwd_length." characters." );
    	}

    	$passwd_hash = md5($passwd.$email_addr);

		//Set some other default values		
		$teamid = 0;
		$project_prefs = "";
		$postal_code = "";

		if (!is_valid_country($country)) {
		    //Return Error
			$country = "International";		    
		}
		
		//Make user
		$user = make_user(
					$email_addr, $username, $passwd_hash,
					$country, $postal_code, $project_prefs, $teamid
		);
		
		if (!$user) {
			return build_error_response( "Couldn't create account" );
    	}
		
		
		$response_object["success"] = "true";
		$response_object["username"] = $user->name;
		$response_object["authenticator"] = $user->authenticator;
		
		return $response_object;
	}
	
	function get_user_from_name($username){
		$authenticator = BoincDb::escape_string($username);
		
		$user = BoincUser::lookup("name LIKE \"".$username."\"");
		
		return $user;
	}
?>