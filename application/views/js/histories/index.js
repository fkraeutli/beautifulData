$j = jQuery.noConflict();

$j(initHistoriesIndex);


function initHistoriesIndex() {

	function addTextRow() {
		
/* 		$j( "#form_texts" ).append( $j( "#form_texts" ).find( ".panel.input:last-child" ).clone() ); */

		$j( "#form_texts" ).find( ".panel.input:last" ).clone().appendTo( $j("#form_texts").find( ".inputs" ) );
		console.log( "Adding Row");
		
	}
	
	$j( "#button_add_more" ).click( prevDef ).click( addTextRow );	
	
}