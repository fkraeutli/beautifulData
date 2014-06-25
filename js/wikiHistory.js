$j(init);


function init() {
	
	$j("#searchPanel input").keypress( function(e) {
	
		if (e.which == 13) {
			
			process();
			
		}
		
	} );
	
	$j("#searchPanel a").click( function (e) {
		
		e.preventDefault();
		process();
		
	});
	
}


function process() {
	
	var query = $j("#searchPanel input").val();
	
	if( ! query ) {
		
		return false;
		
	}
	
	console.log(query);
	
}