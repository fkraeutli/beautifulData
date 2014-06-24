<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Histories extends CI_Controller {

	public function index()	{
	
		$this->load->view( "histories/index.tpl" );
		
	}
	
	public function process() {
		
		$texts = $_POST["texts"];
		
		
	}
}