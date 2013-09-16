<?php

	function print_header(){
		echo <<<HTML
			<div id="header">
				<a href="/"><img width="396" border="0" height="125" style="float: left;" alt="Docking@Home Logo" src="/images/dh_logo.png"></a>
				<div width="400" height="125" style="float: right;"><img border="0" alt="Docking@Home Logo" src="media/exscitech_logo.png"></div>
			</div>

			<div id="content">

HTML;
	}

	function print_footer(){
		echo <<<HTML
		</div>
		<div id="footer">
			<p>&nbsp;</p>
			<hr>
			<p>&copy;2009 <a href="http://www.udel.edu/">University of Delaware</a>, Docking@Home Project</p>
			<p>Web Design: <a href="http://interactivemedia.udel.edu/">University of Delware Interactive Media</a> <a href="/about/project/staff.php">Students</a></p>
		</div>
HTML;
	}

	function build_error_response( $message ){
		$response = array();
		$response['success'] = false;
		$response['error'] = $message;
		return $response;
	}

?>
