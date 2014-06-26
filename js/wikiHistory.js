$j = jQuery.noConflict();

$j(init);

var num_articles = 50;
var req_url = "http://en.wikipedia.org/w/api.php?format=json&action=query&prop=revisions%7Cinfo&rvprop=content&rvlimit=" + num_articles + "&titles=";

var maxChars = 3000,
	transition_duration = 500,
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

function initInteraction() {
	
	 $j("#wrapper").bind("mousewheel", function(e){
	 
	 	var scroll = e.originalEvent.wheelDelta,
	 		threshold = 25;
	 	
	 	if (scroll < -1 * threshold) {
		 	
		 	next();
		 	console.log("next");
		 	
	 	} else if (scroll > threshold) {
		 	
		 	prev();
		 	console.log("prev");
		 	
	 	}
        
    })
    
	window.addEventListener('keyup', function(event) { 
	
		if ( event.keyCode == 40 ) {
			
			next();
			
		} else if ( event.keyCode == 38 ) {
			
			prev();
			
		}
	
	}, false);
	
	
	/*
	var menu = $j("<ul class=\"menu\">").insertAfter( $j("#output h1") )
	
	menu.append("<li><a id=\"button_play\" href=\"#\" onclick=\"play();\">Play</a></li>");
	menu.append("<li><a id=\"button_play_backward\" href=\"#\" onclick=\"play_backward();\">Play Backward</a></li>");
	menu.append("<li><a id=\"button_rewind\" href=\"#\" onclick=\"rewind();\">Rewind</a></li>");
	*/
}

function search() {
	
	$j("#search_panel").fadeOut();
	
	query = $j("#search_panel input").val();
	
	if( ! query ) {
		
		return false;
		
	}
	
	$j("#ajax_loader").fadeIn();
		
	$j.ajax({
		
		url: req_url + query,
		dataType: "jsonp",
		error: function (err) {
			console.log( err )
		},
		success: function( data ) {
			
			$j("#ajax_loader").fadeOut();
		
			process( data, query );
		}
		
	})
	
	
}

function update( data ) {
	
	function storePositions( prefix ) {
		
		if ( prefix === undefined ) {
			
			prefix = "";
			
		}
		
		$j(".page span").each( function(d) {
			
			var pos = $j(this).position();
			
			$j(this).attr("data-pos-" + prefix + "-top", pos.top)
				.attr("data-pos-" + prefix + "-left", pos.left)
			
		} );
		
	}
	
	var output = d3.select("#output .page");
	
	var dataUpdate = output.selectAll("span")	
		.data( data, function(d) { return d.id } );
		
	var dataEnter = dataUpdate.enter();
	var dataExit = dataUpdate.exit();
	
	d3.select("#pageNum").html( current );
	
	storePositions("old");
	
	dataUpdate.classed("added", false)
		.classed("old", true);
		
	var entered = dataEnter.append("span")
		.html( function(d) {
		
			return d.text + " ";
			
		})
		
	if ( current > 0 ) {
		
		window.setTimeout( function() {

			entered.classed("added", true);

		}, 100);
	}
		
	
	dataExit.classed("remove", true)
		.style("display", "none");
	
	output.selectAll("span").sort( function (a, b) {
		
		return a.currentPos - b.currentPos;
		
	});
	
	$j(".page span.remove").each(function() {
		
		$j(this).css("position", "absolute")
			.css( "top", $j(this).attr("data-pos-old-top") + "px" )
			.css( "left", $j(this).attr("data-pos-old-left") + "px" );
		
		var el = $j(this);
		
		window.setTimeout( function() {

		   el.addClass("removing");

		}, 100);
		
	})
	
	dataExit.style("display", "")
		.transition()
		.duration(transition_duration)
		.remove();

}

function process( data, query ) {
	
	var pageIds = Object.keys(data.query.pages);
	
	var revisions = data.query.pages[ pageIds[0] ].revisions;
	
	var texts = [];
	
	for ( var i = 0; i < revisions.length; i++ ) {
		
		var text = revisions[ i ][ "*" ];
		
		
		text = txtwiki.parseWikitext( text );
		text = stripBrackets( text );
		text = text.substring( 0, maxChars);
		
		text = text.replace(/==/g, "<p>");

		texts.push( text )
		
	}
	
	DEBUG_texts = texts;
	
	dataset = diffTexts( texts )
	
	$j("#output h1").html( ucfirst( query ) );

	initInteraction();

	update( dataset[current] );
	
	
}

function play() {

	var speed = transition_duration / 2;
	next();
	
	if ( current < num_articles ) {
	
		setTimeout(play, speed);
		
	}
	
	
}

function play_backward() {

	var speed = transition_duration / 2;
	
	if ( current > 0 ) {
	
		prev();
		setTimeout(play_backward, speed);
		
	}
	
	
}

function rewind() {
	
	current = 0;
	
	update( dataset[ current ] );
	
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


function stripBrackets( text ) {
			
	function push() {
	
		var nextLevel = currentLevel + 1;
	
		stack[nextLevel] = stack[currentLevel].substr( stack[currentLevel].indexOf("{{") + 2 );
		stack[currentLevel] = stack[currentLevel].substr(0, stack[currentLevel].indexOf("{{"));
		
		currentLevel = nextLevel;
		
	}
	
	function pop() {
		
		var nextLevel = currentLevel - 1;
		
		stack[nextLevel] = stack[nextLevel] + stack[currentLevel].substr( stack[currentLevel].indexOf( "}}" ) + 2 );
		
		currentLevel = nextLevel;
	}
	
	function run() {	
	
		if ( stack[ currentLevel ].indexOf("}}") > -1  && currentLevel < maxExec) {

			if ( stack[ currentLevel ].indexOf("{{") > -1 ) {
			
				if ( stack[currentLevel].indexOf("{{") < stack[currentLevel].indexOf("}}") ) {
					
					push();
					
				} else {
					
					pop();
					
				}
			
			} else if ( stack[ currentLevel ].indexOf("}}") > -1 ) {
				
				pop();
				
			}
			
			run();
			
		} else {
			
			ret = stack[0];
			
		}
	
	}
	
	var stack = [ text ];	

	var currentLevel = 0;
	
	var maxExec = 100;
	
	var ret = "";
	
	run();
	
	return ret;		
	
}


/* DEBUG */

DEBUG_example_texts = [
	"This is an article on history.",
	"This is a text on history.",
	"This is a very brief text on history.",
	"What you read is a sentence on history."
]

function mockupStuff() {
	
	query = "Examples";
	
	$j("#search_panel").hide();
	
	dataset = diffTexts ( DEBUG_example_texts );
	
	initInteraction();
	
	update( dataset[current] );
	
}