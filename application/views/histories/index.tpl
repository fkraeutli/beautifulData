<? $this->load->view("header.tpl"); ?>

<script type="text/javascript" src="<?=$this->config->item("base_index");?>/scripts/histories/index.js"></script>

<div class="row">

	<div class="large-12 columns">
	
		<h1>Text History</h1>

		<form id="form_texts" method="post" action="<?=$this->config->item("base_index");?>/histories/process">
		
			<div class="inputs">
		
				<div class="panel input">
				
					<textarea name="texts[]"></textarea>
			      
				</div>
				
			</div>
			
			<div class="panel buttons right">
			
				<a href="#" class="button radius" id="button_add_more">Add more&hellip;</a>
				<input type="submit" class="button radius alert" value="Visualise">
				
			</div>
	
		</form>
	
	</div>	

</div>


<? $this->load->view("footer.tpl"); ?>