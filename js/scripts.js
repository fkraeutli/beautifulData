$j = jQuery.noConflict();

$j(initHistoriesIndex);


function initHistoriesIndex() {

	function prevDef(e) {
		
		e.preventDefault();
		
		return false;
		
	}

	for( var i = 1; i <= 3; i++ ) {
	
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

function makeData() {
	
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

	var texts = [];
	
	$j( ".input textarea" ).each( function() {
		
		texts.push( $j(this).val() );
		
	} );
	
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

function tabulate() {

	function identify( data ) {
		
		var level = 0;

		// identify first revision
		for (var i = 0; i < data[0].length; i++) {
			
			data[0][i].id = i;
			data[0][i].pos = i;
			data[0][i].counter = 1;
			
		}
		
		var count = data[0].length;
		
		for( row = 1; row < data.length; row++ ) {
			
			for( col = 0; col < data[row].length; col++ ) {
				
				var word = data[row][col];
				
				// mark current position
				word.pos = col;
				
				// new additions
				if ( word.row === undefined ) {
					
					word.level = level;
					word.id = count;
					word.counter = 0;
					
					count++;
					
				}
				
				// kept, moved
				if ( word.row >= 0 ) {
					
					var oldWord = word;
					
					word = data[ row - 1 ][ word.row ];
					word.level = level;
					word.row = oldWord.row;
					
/* 					data[ row - 1 ][ word.row ].removed = true; */
					data[ row - 1 ][ word.row ] = undefined;
				}
				
				word.counter = word.counter === undefined ? 1 : word.counter + 1;	
				
			}
			
			level++;
			
		}
		
		return data;
		
	}
	
	var data = makeData();
	
	data = identify( data );	
	
	console.log(data);
	
	DEBUG_data = data;
	
}

function visualise() {
	
	var data = makeData();
	
	var output = d3.select( "#output" );
	
	output.selectAll("p")
		.data( data )
	.enter()
		.append("p");
		
	output.selectAll("p").selectAll("span")
		.data( function(d) { return d } )
	.enter()
		.append( "span" )
		.classed("new", function(d) {
		
			if( d.row === undefined) {
				
				return true;
				
			}
			
			return false;
			
		})
		.html( function(d) {
		
			return d.text + " ";
			
		});
	
		
}

/* DEBUG */

function addDummyText() {
	
	$j( ".panel.input:eq(0) textarea" ).html("This is an article on history.");

	$j( ".panel.input:eq(1) textarea" ).html("This is a text on history.");
	
	$j( ".panel.input:eq(2) textarea" ).html("This is a very brief text on history.");
	
	$j( ".panel.input:eq(3) textarea" ).html("What you read is a sentence on history.");
	
}