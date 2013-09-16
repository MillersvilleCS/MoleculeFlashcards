<?php

	function print_exscitech_header(){
		echo '
		<div id="page_wrapper">
		<div id="header">
			<div id="exscitech_logo">
				<a href="/"><img border="0" alt="ExSciTecH Logo" src="./media/exscitech_logo.png"></a>
				<span id="beta_tag">(Beta)</span>
			</div>
			<a href="http://docking.cis.udel.edu/"><img id="docking_logo" alt="Docking@Home Logo" src="./media/images/dh_logo.png"></a>
			
			<div id="user_info"></div>
		</div>
	
		<div id="nav_bar">
			<a class="nav_link" href="./">Home</a> ·  
			<a class="nav_link" href="./job_submit.php">Job Submission <span style="font-size: xx-small;">(Coming soon!)</span></a> · 
			<a class="nav_link" href="./flashcards.php">Flashcards</a> · 
			<a class="nav_link" href="./contributors.php">Contributors</a> · 
			<a class="nav_link" href="http://docking.cis.udel.edu/">Docking@Home</a>
		</div>
		
		<div id="body_wrapper">';
	}
	
	function print_exscitech_footer(){
		echo '
				</div>
			
		</div>
		<div id="footer">
			<p>&nbsp;</p>
			<hr/>
			<p>&copy;2013 <a href="http://www.udel.edu/">University of Delaware</a>, Docking@Home Project</p>
			<div>
				<span id="cc_licence">This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc/3.0/us/">Creative Commons Attribution-NonCommercial 3.0 United States License</a></span>
				<a rel="license" href="http://creativecommons.org/licenses/by-nc/3.0/us/"><img alt="Creative Commons License" style="border-width:0" src="http://i.creativecommons.org/l/by-nc/3.0/us/80x15.png" /></a>
			</div>
			
		</div>
	</div>';
	
		if( $_SERVER['HTTP_HOST'] != "docktest.gcl.cis.udel.edu" ){
			echo "<script type=\"text/javascript\">
	
			  var _gaq = _gaq || [];
			  _gaq.push(['_setAccount', 'UA-43237124-1']);
			  _gaq.push(['_trackPageview']);
			
			  (function() {
			    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
			    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
			    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
			  })();
			
			</script>";		
		}
	}
	
?>