$j = jQuery.noConflict();

$j(initHistoriesIndex);


function initHistoriesIndex() {

	function prevDef(e) {
		
		e.preventDefault();
		
		return false;
		
	}

	for( var i = 1; i <= 1; i++ ) {
	
		addTextRow();
	
	}

	$j( "a.button" ).click( prevDef );

	$j( "#button_add_more" ).click( addTextRow );	
	$j( "#button_visualise" ).click( visualise );	
	
	addDummyText();

}


function addTextRow() {
	
	$j( "#form_texts" ).find( ".panel.input:last" ).clone().appendTo( $j("#form_texts").find( ".inputs" ) );
	
}

function visualise() {

	function format( input, parent ) {
		
		var output = [];
		
		for ( var i = 0; i < input.length; i++ ) {

			var d = input[i];
			
			
			if( typeof d != "object" ) {
				
				d = {text: d};
			
			}
			
			d.parent = parent;
							
			output.push( d );
			
		};
		
		return output;
	
	}
		
	function HTMLify( output ) {
		
		var str = "<p>";
		
		$j.each( output, function(d) {
		
			var span = $j("<span>");
			
			span.html( output[d].text );
			
			str += span.prop( "outerHTML" ) + " ";
			
		});
		
		str += "</p>";
		
		return str;
		
	}
	
	var texts = [];
	
	$j( ".input textarea" ).each( function() {
		
		texts.push( $j(this).val() );
		
	} );
	
	$j( "#output" ).html( "" );
	
	for( var i = 1; i < texts.length; i++ ) {
		
		o = texts[ i - 1 ].replace( /\s+$/, '' );
		n = texts[ i ].replace( /\s+$/, '' );

		var difference = diff( o == "" ? [] : o.split(/\s+/), n == "" ? [] : n.split(/\s+/) );
		
		oFormated = format( difference.o, false );
		nFormated = format( difference.n, i -  1 );
		
		if( i == 1 ) {
			
			$j("#output").append( HTMLify( oFormated ) );
			
		}
		
		$j("#output").append( HTMLify( nFormated ) );
		
		console.log( oFormated );
		console.log( nFormated );

	}
	
	
}

/* DEBUG */

function addDummyText() {
	
	$j( ".panel.input:eq(0) textarea" ).html("This is an article on history.");

	$j( ".panel.input:eq(1) textarea" ).html("This is a text on history.");
	
	$j( ".panel.input:eq(2) textarea" ).html("This is a very brief text on history.");
	
	$j( ".panel.input:eq(3) textarea" ).html("What you read is a sentence on history.");
	
}