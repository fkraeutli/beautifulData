$j = jQuery.noConflict();

$j(initHistoriesIndex);


function initHistoriesIndex() {

	function addTextRow() {
	
		$j( "#form_texts" ).find( ".panel.input:last" ).clone().appendTo( $j("#form_texts").find( ".inputs" ) );
		
	}

	function prevDef(e) {
		
		e.preventDefault();
		
		return false;
		
	}

	for( var i = 1; i <= 3; i++ ) {
	
		addTextRow();
	
	}

	$j( "a.button" ).click( prevDef );

	$j( "#button_add_more" ).click( addTextRow );	
	$j( "#button_visualise" ).click( function() {
		
		var data = getTexts();
		
		console.log( diffTexts( data ) );
		
	} );	
	
	addDummyText();

}

function getTexts() {

	var texts = [];
	
	$j( ".input textarea" ).each( function() {
		
		texts.push( $j(this).val() );
		
	} );
	
	return texts;
}

/* DEBUG */

function addDummyText() {
	
	$j( ".panel.input:eq(0) textarea" ).html("This is an article on history.");

	$j( ".panel.input:eq(1) textarea" ).html("This is a text on history.");
	
	$j( ".panel.input:eq(2) textarea" ).html("This is a very brief text on history.");
	
	$j( ".panel.input:eq(3) textarea" ).html("What you read is a sentence on history.");
	
}