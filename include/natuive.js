/* natUIve by rado.bg */
	
function addClass ( el, className ) {

	if (el.classList) {
		el.classList.add(className);
	} else {
		el.className += ' ' + className;
	}
  	
}

function removeClass ( el, className ) {

	if (!el) return;
	if (el.classList) {
		el.classList.remove(className);
	} else {
		el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
	}
  	
}

function hasClass ( el, className ) {

	if (el.classList) {
		return el.classList.contains(className);
	} else {
		return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
	}

}

function toggleClass ( el, className ) {

	if ( hasClass ( el, className ) ) {
		removeClass ( el, className );
	} else {
		addClass ( el, className );
	}
	
}

var parseHTML = function ( str ) {

	tmp = document.implementation.createHTMLDocument('Parsed');
	tmp.body.innerHTML = str;
	return tmp.body;

}

function forEach( selector, fn ) { // Accepts both an array and a selector

	elements = (typeof selector == 'object') ? selector : document.querySelectorAll(selector);
	for (var i = 0; i < elements.length; i++) {
		fn(elements[i], i);
	}

}
	
function addEventHandler( el, eventType, handler ) {

	if (el.addEventListener) {
	     el.addEventListener ( eventType, handler, false );
	} else {
		if (el.attachEvent) {
	    	el.attachEvent ( 'on'+eventType, handler);
		}
	}     

}

function stopEvent( e ) {
 
	if (!e) var e = window.event;
 
	//e.cancelBubble is supported by IE, this will kill the bubbling process.
	e.cancelBubble = true;
	e.returnValue = false;
 
	//e.stopPropagation works only in Firefox.
	if ( e.stopPropagation ) {
		e.stopPropagation();
	}
	if ( e.preventDefault ) {
		e.preventDefault();
	}
 
	return false;

}

function thisIndex (el) {

    var nodes = el.parentNode.childNodes, node;
    var i = count = 0;
    while( (node=nodes.item(i++)) && node!=el )
        if( node.nodeType==1 ) count++;
    return (count);

}

if ( typeof document.body.style.textShadow == 'undefined' ) { // Old browsers without (good) CSS3 support. IE9- detector

	forEach( 'table', function (el, i) {
		
		el.insertAdjacentHTML('beforebegin', '<div style="overflow-x: scroll"></div>');
		el.previousSibling.insertAdjacentHTML('beforeend', el.outerHTML);
		el.outerHTML = '';
		
	});

}

/* URI parameters */

function updateURLParameter ( url, param, paramVal ) { // return input string with updated/added URL parameter

    var newAdditionalURL = "";
    var tempArray = url.split("?");
    var baseURL = tempArray[0];
    var additionalURL = tempArray[1];
    var temp = "";
    if (additionalURL) {
		tempArray = additionalURL.split("&");
		for (i=0; i<tempArray.length; i++){
			if(tempArray[i].split('=')[0] != param){
				newAdditionalURL += temp + tempArray[i];
				temp = "&";
            }
        }
    }

    var rows_txt = temp + "" + param + "=" + paramVal;
    return baseURL + "?" + newAdditionalURL + rows_txt;

}

function getURLParameters () { // return all URL parameters in an array

	var res = {},
		re = /[?&]([^?&]+)=([^?&]+)/g;
	location.href.replace(re, function(_,k,v) {
		res[k] = v;
	});
	return res;

}

/* URI parameters relay. Omit links starting with "javascript", "mailto", skip parameters not listed in the array */

var parameters_list = new Array ('parameter1','parameter2' );

function relayParameters () {

	parameters = getURLParameters();

	forEach('a[href]', function(el, i) {

		for (var name in parameters) {

			if ( parameters_list.indexOf(name) == -1 ) continue;

			if ( !el.href.indexOf('javascript') || (!el.href.indexOf('mailto') ) ) continue;
			var hash = el.href.split('#')[1] ? ( '#' + el.href.split('#')[1] ) : '';
			el.href = updateURLParameter( el.href.split('#')[0], name, parameters[name] ) + hash;
	
		} 
	
	});

}

/* Tooltip */

/*
var tip = 0;

function hideTip (e) {
	
	if (tip) {

		removeClass ( tip, 'open' );
		tip = 0;
		return false;
	}
	
		alert(tip.className);

}

function showTip (e) {
stopEvent( e );
	if (tip) {
		removeClass ( tip, 'open' );
		alert('a');
		hideTip(e);
	
	}
	
	var event = e || window.event;
	var el = event.target || event.srcElement;
	
	tip = el.querySelector('.tip');

	if (!tip) return; // fix it not to log error in console
	
	addClass ( tip, 'open' );
	
}
*/

Math.easeInOutQuad = function ( t, b, c, d ) {

	t /= d/2;
	if (t < 1) {
		return c/2*t*t + b
	}
	t--;
	return -c/2 * (t*(t-2) - 1) + b;

};

var requestAnimFrame = (function() {
	
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function( callback ) {
		window.setTimeout(callback, 1000 / 60); 
	};
	
})();

function scrollTo( to, callback ) {

	// figure out if this is moz || IE because they use documentElement
	var doc = (navigator.userAgent.indexOf('Chrome') != -1 || navigator.userAgent.indexOf('Firefox') != -1 || navigator.userAgent.indexOf('Trident') != -1) ? document.documentElement : document.body,
	start = doc.scrollTop,
	change = to - start,
	currentTime = 0,
	increment = 20;

	if ( (navigator.userAgent.indexOf('Trident') ) != -1 ) { // Turn off animation for IE; WP8 animates by itself
		
		doc.scrollTop = to;
		return false;
		
	}

	var animateScroll = function(){
	    // increment the time
	    currentTime += increment;
	    // find the value with the quadratic in-out easing function
	    var val = Math.easeInOutQuad(currentTime, start, change, 400);
	    // move the document.body
	    doc.scrollTop = val;
	    // do the animation unless its over
	    if(currentTime < 400) {
			requestAnimFrame(animateScroll);
	    } else {
			if (callback && typeof(callback) === 'function') {
				// the animation is done so lets callback
				callback();
			}
	    }
	};
	animateScroll();

}

function removeBlackbox () {

	var blackbox = document.getElementById('blackbox');
	if (blackbox) document.body.removeChild( blackbox );
	removeClass ( document.querySelector('html'), 'nooverflow' );

}

function modalWindow (e) {

	document.body.onkeyup = function(e) {

		var event = e || window.event;

	    if (event.keyCode == 27) { // esc
			
			removeBlackbox ();
			
	    }

	};
	
	var event = e || window.event;
	var el = event.target || event.srcElement;

	if ( hasClass( el, 'lightbox') ) { // Show an image lightbox...

		document.body.insertAdjacentHTML('afterbegin', '<div id="blackbox"> </div>');
		addClass ( document.querySelector('html'), 'nooverflow' );
		
		/* Add any <a><img> siblings with description to a .slider and initialise its controls */
		images = '';

		elements = el.parentNode.querySelectorAll('.lightbox');
		current_slide = 0;
		for (var i = 0; i < elements.length; i++) {
			images += '<div><img src="' + elements[i].href + '"></div>';
			if ( elements[i] == el ) { current_slide = i; }
		}

		document.getElementById('blackbox').innerHTML = '<div class="close"> ← ' + document.title + '</div><div class="slider lightbox">' + images + '</div><div id="blackbox-bg"></div>';
		
		if ( makeSlider ) { 

			new_slider = makeSlider( document.querySelector('#blackbox .slider') );
			new_slider.scrollLeft = current_slide * new_slider.offsetWidth;
			slider = new_slider;
			moveIndex ( current_slide );

		}

		document.getElementById('blackbox-bg').onclick = document.querySelector('#blackbox .close').onclick = removeBlackbox;
		
	} else { // ... or load external content in a modal window 
		
		if ( navigator.userAgent.indexOf('MSIE 8') != -1 ) {

			window.open (el.href, '_blank'); 
			return false;

		}

		request = new XMLHttpRequest();
		request.open('GET', el.href.split('#')[0], true);

		request.onload = function() {

			if (request.status >= 200 && request.status < 400){
			// Success
				container = (typeof el.href.split('#')[1] != 'undefined') ? ( '#' + el.href.split('#')[1] ) : 0;
				document.body.insertAdjacentHTML('afterbegin', '<div id="blackbox"> </div>');
				addClass ( document.querySelector('html'), 'nooverflow' );
				blackbox = document.getElementById('blackbox');
				blackbox.insertAdjacentHTML('afterbegin', '<div class="close"> ← ' + document.title + '</div>');
				if (container) {
					parsed = parseHTML(request.responseText);
					if ( !parsed.querySelector(container) ) { removeBlackbox (); return false; }
					blackbox.insertAdjacentHTML('beforeend', parsed.querySelector(container).innerHTML);
						
				} else {
					blackbox.insertAdjacentHTML('beforeend', request.responseText);
				}

				blackbox.querySelector('.close').onclick = removeBlackbox;
				
				relayParameters();
			
			} else { 
			// Error
				
			}

		};
		
		request.onerror = function() {
		  // Error
		};
		
		request.send();
		
	}
	
	return false;

}

/*** Start ***/

/* Relay URI parameters to links */

relayParameters();

/* Tooltip */

forEach('.tool', function(el, i) {
	
/*
	el.onclick = showTip;
		
	el.onmouseover = showTip;
	el.onmouseout = hideTip;
*/
	
	t = el.querySelector('.tip');
	if (!t) return;
	
/* 	addEventHandler(t, 'touchmove', function (e) { document.querySelector('.tip.open').removeClass('open'); }, false); */
	el.style.position = 'static'; // dangerous with absolutely-positioned containers, which should be avoided anyway
	el.parentNode.style.position = 'relative'; // dangerous with absolutely-positioned containers, which should be avoided anyway
	t.style.top = (t.parentNode.offsetTop + t.parentNode.offsetHeight) + 'px';
	t.style.width = '100%';
			
});

/* Add 'Back to top' button */

document.querySelector(	document.querySelector('#footer > div > div') ? '#footer > div > div' : 'body' ).insertAdjacentHTML('beforeend', '<a class="backtotop" href="#"> ↑ </a>');

/* Animate anchor links. */

function animateAnchors (e) {
	
	var event = e || window.event;
	var el = event.target || event.srcElement;
	
	hash = document.getElementById( el.href.split('#')[1] );

	document.querySelector('#nav-trigger').checked = false; 
	removeClass ( document.querySelector('#nav-main > div'), 'open' );

	if ( navigator.userAgent.indexOf('Android') == -1) { // No doc.scrollTop on Android
	
		scrollTo( (hash == null) ? 0 : hash.offsetTop, function (e) { 
			window.location = el.href; 
		});
		return false;

	} else {

		window.location = el.href;

	}
	
};
	
forEach( 'a[href*="#"]', function (el, i) {
	
	el.onclick = animateAnchors;
	
});

/* Modal window: open a link inside it. Also lightbox with images */

forEach('a.modal, a.lightbox', function(el, i) {
	
	el.onclick = modalWindow;
	
});

/* Auto textarea height */
	
forEach('textarea', function(el, i){

	el.onkeyup = function (e) { /* To fix */

		var event = e || window.event;
		var el = event.target || event.srcElement;

		while (
			el.rows > 1 &&
			el.scrollHeight < el.offsetHeight
		)
		{	el.rows--; }
		
		while (el.scrollHeight > el.offsetHeight) {	

			if (el.rows > 20) {
				break;
			}
			el.rows++;

		}

		el.rows++
		
	};

});

/* Form validation */

forEach('form', function (el, i) {
	
	el.onsubmit = function (e) {

		var event = e || window.event;
		el = event.target || event.srcElement;

		ready_to_submit = true;

		forEach( el.querySelectorAll('.mandatory'), function (el, i) {
			
			if ( 
				( el.querySelector('input, select, textarea') && !el.querySelector('input, select, textarea').value ) || 
				( el.querySelector('input[type="checkbox"]') && !el.querySelector('input[type="checkbox"]').checked ) ||
				( el.querySelector('input[type="radio"]') && !el.querySelector('input[type="radio"]').checked )
			   ) { 

				ready_to_submit = false;
				el.querySelector('input').focus();
				addClass (el, 'alert');
				return;

			} else {
				
				removeClass (el, 'alert');
				
			}

		});

		if (!ready_to_submit) scrollTo(el.offsetTop + el.parentNode.offsetTop);

		return ready_to_submit;
		
	};
	
});

forEach( 'input[type="file"]', function (el, i ) {
	
	el.onchange = function (e) {
		
		var event = e || window.event;
		el = event.target || event.srcElement;
		el.parentNode.querySelector('span').innerHTML = el.value.substring(el.value.lastIndexOf('\\') +1)
		
	};
	
});

/* Accordion */

forEach( '.accordion', function(el, i) {
	
	if ( el.querySelector('input.trigger') ) { // Remove CSS-only triggers
	
		el.querySelector('input.trigger').outerHTML = '';
	
	}
	
	el.onclick = function (e) {
		
		stopEvent( e );

		el.querySelector('div').style.maxHeight = ((el.querySelector('div').style.maxHeight == '') ? (el.querySelector('div').scrollHeight + 'px') : '');
		
		toggleClass(el, 'open');		
		
		if ( hasClass ( el.parentNode.parentNode, 'accordion' ) ) { // Embedded accordion
			el.parentNode.style.maxHeight = el.querySelector('div').scrollHeight + el.parentNode.scrollHeight + 'px';
		}

		return false;
		
	};
	
	el.querySelector('div').onclick = function (e) {  
		var event = e || window.event; event.cancelBubble = true; 
	};

});

if ( 'ontouchstart' in window ) { /* iOS: remove sticky hover state */

	document.body.insertAdjacentHTML('beforeend', '<style> a[href]:hover { color: inherit; } .tool:hover .tip { display: none; } </style>');

}

addEventHandler( window, 'load', function() {

/* Baseline align images vertically. Using standard line height at 22px */

	var line_height = 22;
	
	forEach( '#content img', function (el) {
		
		extra_padding = ((Math.round(el.height/line_height)+1)*line_height - el.height);
		
		if ( extra_padding > line_height ) { 
		
			extra_padding -= line_height; 
		
		}
		
		el.style.paddingBottom = extra_padding + 'px';
		
	});

});
