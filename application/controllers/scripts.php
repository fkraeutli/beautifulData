<?
	class Scripts extends CI_Controller {
		
		function __construct() {
			parent::__construct();
			if($this->uri->segment(2) != "load") {
				redirect("/scripts/load/".$this->uri->uri_string());
			}
		}
		
		function load($path) {
			$string = "";
			for($i=4;$i<=$this->uri->total_segments();$i++) {
				$string .= $this->uri->segment($i);
				if($i<$this->uri->total_segments()) {
					$string	.= "/";
				}
			}
			if($this->uri->segment(4) != "js") {
				$this->load->view("js/$string");
			} else {
				redirect($this->config->item("base_url"). "/$string");
			}
		}
		
	}	
?>