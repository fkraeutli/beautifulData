function diffTexts( texts ) {
	
	if ( texts === undefined ) {
		
		console.error( "You must pass an argument" );
		return false;
		
	}
	if ( ! texts instanceof Array ) {
		
		console.error( "You must pass your data as an Array" );
		return false;
		
	}
	
	if ( texts.length <= 1 ) {
		
		console.error( "You must pass at least two texts" );
		return false;
		
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
	
	var data = processRevisions( texts );
	
	return trackChanges( data );
}

