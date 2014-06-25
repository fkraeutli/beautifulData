$j = jQuery.noConflict();

$j(init);

var num_articles = 50;
var req_url = "http://en.wikipedia.org/w/api.php?format=json&action=query&prop=revisions%7Cinfo&rvprop=content&rvlimit=" + num_articles + "&titles=";

var maxChars = 10000,
	transition_duration = 1000,
	current = 0,
	dataset,
	query;

function init() {
	
	$j("#search_panel input").keypress( function(e) {
	
		if (e.which == 13) {
			
			search();
			
		}
		
	} );
	
	$j("#search_panel a").click( function (e) {
		
		e.preventDefault();
		search();
		
	});
	
}

function search() {
	
	$j("#search_panel").fadeOut();
	
	query = $j("#search_panel input").val();
	
	if( ! query ) {
		
		return false;
		
	}
		
	$j.ajax({
		
		url: req_url + query,
		dataType: "jsonp",
		error: function (err) {
			console.log( err )
		},
		success: function( data ) {
			
			process( data, query );
		}
		
	})
	
	
}

function update( data ) {
	
	$j("#output h1").html( ucfirst( query ) );
	
	var output = d3.select("#output .page");
	
	var dataUpdate = output.selectAll("span")	
		.data( data, function(d) { return d.id } );
		
	var dataEnter = dataUpdate.enter();
	var dataExit = dataUpdate.exit();
	
	dataEnter.append("span")
		.html( function(d) {
		
			return d.text + " ";
			
		})
		.classed("added", true);
	
	dataExit.transition()
		.remove();
		
	dataUpdate.classed("added", false)
		.classed("old", true);
		
	output.selectAll("span").sort( function (a, b) {
		
		return a.currentPos - b.currentPos;
		
	});
}

function process( data, query ) {
	
	
	var pageIds = Object.keys(data.query.pages);
	
	var revisions = data.query.pages[ pageIds[0] ].revisions;
	
	var texts = [];
	
	for ( var i = 0; i < revisions.length; i++ ) {
		
		var text = revisions[ i ][ "*" ];
		
		
		text = txtwiki.parseWikitext( text );
		text = text.substring( 0, maxChars);

		texts.push( text )
		
	}
	
	dataset = diffTexts( texts )

	update( dataset[current] );
	
	
}

function next() {
	
	if( current < num_articles ) {
		
		current++;
		update( dataset[ current ]);
		
	}
	
}

function prev() {
	
	if( current > 0 ) {
		
		current--;
		update( dataset[ current ]);
		
	}
	
}

/* Tools */

function ucfirst(str) {
  //  discuss at: http://phpjs.org/functions/ucfirst/
  // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // bugfixed by: Onno Marsman
  // improved by: Brett Zamir (http://brett-zamir.me)
  //   example 1: ucfirst('kevin van zonneveld');
  //   returns 1: 'Kevin van zonneveld'

  str += '';
  var f = str.charAt(0)
    .toUpperCase();
  return f + str.substr(1);
}

/* DEBUG */

DEBUG_texts = [
	"This is an article on history.",
	"This is a text on history.",
	"This is a very brief text on history.",
	"What you read is a sentence on history."
]

function mockupStuff() {
	
	query = "Examples";
	
	$j("#search_panel").hide();
	
	dataset = diffTexts ( DEBUG_texts );
	
	update( dataset[current] );
	
}