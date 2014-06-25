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
		
		var data = makeData();
		
		console.log( trackChanges( data ) );
		
	} );	
	
	addDummyText();

}


function makeData( texts ) {
	
	if ( texts === undefined ) {
		
		var texts = [];
		
		$j( ".input textarea" ).each( function() {
			
			texts.push( $j(this).val() );
			
		} );
		
	}
	
	return processRevisions( texts );
	
}

function processRevisions( texts ) {
	
	function format( input ) {
		
		var output = [];
		
		for ( var i = 0; i < input.length; i++ ) {

			var d = input[i];
			
			if( typeof d != "object" ) {
				
				d = {text: d};
			
			}
							
			output.push( d );
			
		};
		
		return output;
	
	}
	
	var data = [];
	
	for( var i = 1; i < texts.length; i++ ) {
		
		o = texts[ i - 1 ].replace( /\s+$/, '' );
		n = texts[ i ].replace( /\s+$/, '' );

		var difference = diff( o == "" ? [] : o.split(/\s+/), n == "" ? [] : n.split(/\s+/) );
		
		oFormated = format( difference.o );
		nFormated = format( difference.n );
		
		if( i == 1 ) {
			
			data.push( oFormated );
			
		}
		
		data.push( nFormated );

	}
	
	return data;		

}

function trackChanges( data ) {

	function initialise( word ) {
		
		word.id = count;
		word.currentPos = i;
		word.count = 0;
		
		delete word.row;
		 
		count++;
		
	}

	var count = 0;
	
	for ( var i = 0; i < data[0].length; i++ ) {
		
		var word = data[0][i];
		
		initialise(word);
		
	}
	
	for ( var rev = 1; rev < data.length; rev++ ) {
		
		for ( var i = 0; i < data[ rev ].length; i++ ) {
			
			var word = data[ rev ][ i ];
			var prevWord = data[ rev - 1 ][ word.row ];
			
			if ( word.row !== undefined ) {
				
				// word has been kept or moved
				
				word.id = data[ rev - 1 ][ word.row ].id;
				word.currentPos = prevWord.nextPos = i;
				word.count = prevWord.count + 1;
				
			} else {
				
				// word has been added
				
				initialise( word )
				
			}
			
		}
		
	}
		
	return data;

	
}

/* UTILS */

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
 
    var copy = obj.constructor();
 
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    
    return copy;
}

/* DEBUG */

function addDummyText() {
	
	$j( ".panel.input:eq(0) textarea" ).html("This is an article on history.");

	$j( ".panel.input:eq(1) textarea" ).html("This is a text on history.");
	
	$j( ".panel.input:eq(2) textarea" ).html("This is a very brief text on history.");
	
	$j( ".panel.input:eq(3) textarea" ).html("What you read is a sentence on history.");
	
}