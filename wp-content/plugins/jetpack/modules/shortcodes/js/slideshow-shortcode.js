/* global jetpackSlideshowSettings */

function JetpackSlideshow( element, transition, autostart ) {
	this.element = element;
	this.images = [];
	this.controls = {};
	this.transition = transition || 'fade';
	this.autostart = autostart;
}

JetpackSlideshow.prototype.showLoadingImage = function ( toggle ) {
	if ( toggle ) {
		this.loadingImage_ = document.createElement( 'div' );
		this.loadingImage_.className = 'jetpack-slideshow-loading';
		var img = document.createElement( 'img' );
		img.src = jetpackSlideshowSettings.spinner;
		this.loadingImage_.appendChild( img );
		this.loadingImage_.appendChild( this.makeZeroWidthSpan() );
		this.element.append( this.loadingImage_ );
	} else if ( this.loadingImage_ ) {
		this.loadingImage_.parentNode.removeChild( this.loadingImage_ );
		this.loadingImage_ = null;
	}
};

JetpackSlideshow.prototype.init = function () {
	this.showLoadingImage( true );

	var self = this;
	// Set up DOM.
	for ( var i = 0; i < this.images.length; i++ ) {
		var imageInfo = this.images[ i ];
		var img = document.createElement( 'img' );
		img.src = imageInfo.src;
		img.title = typeof imageInfo.title !== 'undefined' ? imageInfo.title : '';
		img.alt = typeof imageInfo.alt !== 'undefined' ? imageInfo.alt : '';
		img.setAttribute( 'itemprop', 'image' );
		img.nopin = 'nopin';
		var caption = document.createElement( 'div' );
		caption.className = 'jetpack-slideshow-slide-caption';
		caption.setAttribute( 'itemprop', 'caption description' );
		caption.innerHTML = imageInfo.caption;
		var container = document.createElement( 'div' );
		container.className = 'jetpack-slideshow-slide';
		container.setAttribute( 'itemprop', 'associatedMedia' );
		container.setAttribute( 'itemscope', '' );
		container.setAttribute( 'itemtype', 'https://schema.org/ImageObject' );

		// Hide loading image once first image has loaded.
		if ( i === 0 ) {
			if ( img.complete ) {
				// IE, image in cache
				setTimeout( function () {
					self.finishInit_();
				}, 1 );
			} else {
				img.addEventListener( 'load', function () {
					self.finishInit_();
				} );
			}
		}
		container.appendChild( img );
		// I'm not sure where these were coming from, but IE adds
		// bad values for width/height for portrait-mode images
		img.removeAttribute( 'width' );
		img.removeAttribute( 'height' );
		container.appendChild( this.makeZeroWidthSpan() );
		container.appendChild( caption );
		this.element.append( container );
	}
};

JetpackSlideshow.prototype.makeZeroWidthSpan = function () {
	var emptySpan = document.createElement( 'span' );
	emptySpan.className = 'jetpack-slideshow-line-height-hack';
	// Having a NBSP makes IE act weird during transitions, but other
	// browsers ignore a text node with a space in it as whitespace.
	if ( -1 !== window.navigator.userAgent.indexOf( 'MSIE ' ) ) {
		emptySpan.appendChild( document.createTextNode( ' ' ) );
	} else {
		emptySpan.innerHTML = '&nbsp;';
	}
	return emptySpan;
};

JetpackSlideshow.prototype.finishInit_ = function () {
	this.showLoadingImage( false );
	this.renderControls_();

	var self = this;
	if ( this.images.length > 1 ) {
		// Initialize Cycle instance.
		jQuery( this.element ).cycle( {
			fx: this.transition,
			prev: this.controls.prev,
			next: this.controls.next,
			timeout: jetpackSlideshowSettings.speed,
			slideExpr: '.jetpack-slideshow-slide',
			onPrevNextEvent: function () {
				return self.onCyclePrevNextClick_.apply( self, arguments );
			},
		} );

		var slideshow = this.element;

		if ( ! this.autostart ) {
			jQuery( slideshow ).cycle( 'pause' );
			this.controls.stop.classList.remove( 'running' );
			this.controls.stop.classList.add( 'paused' );
		}

		this.controls.stop.addEventListener( 'click', function ( event ) {
			var button = event.currentTarget;

			if ( button === event.target ) {
				event.preventDefault();

				if ( ! button.classList.contains( 'paused' ) ) {
					jQuery( slideshow ).cycle( 'pause' );
					button.classList.remove( 'running' );
					button.classList.add( 'paused' );
				} else {
					button.classList.add( 'running' );
					button.classList.remove( 'paused' );
					jQuery( slideshow ).cycle( 'resume', true );
				}
			}
		} );
	} else {
		this.element.children( ':first' ).show();
		this.element.css( 'position', 'relative' );
	}
	this.initialized_ = true;
};

JetpackSlideshow.prototype.renderControls_ = function () {
	if ( this.controlsDiv_ ) {
		return;
	}

	var controlsDiv = document.createElement( 'div' );
	controlsDiv.className = 'jetpack-slideshow-controls';

	var controls = [ 'prev', 'stop', 'next' ];
	for ( var i = 0; i < controls.length; i++ ) {
		var controlName = controls[ i ];
		var label_name = 'label_' + controlName;
		var a = document.createElement( 'a' );

		a.href = '#';
		a.className = 'button-' + controlName;
		a.setAttribute( 'aria-label', jetpackSlideshowSettings[ label_name ] );
		a.setAttribute( 'role', 'button' );

		controlsDiv.appendChild( a );
		this.controls[ controlName ] = a;
	}
	this.element.append( controlsDiv );
	this.controlsDiv_ = controlsDiv;
};

JetpackSlideshow.prototype.onCyclePrevNextClick_ = function ( isNext, i /*, slideElement*/ ) {
	// If blog_id not present don't track page views
	if ( ! jetpackSlideshowSettings.blog_id ) {
		return;
	}

	var postid = this.images[ i ].id;
	var stats = new Image();
	stats.src =
		document.location.protocol +
		'//pixel.wp.com/g.gif?host=' +
		encodeURIComponent( document.location.host ) +
		'&rand=' +
		Math.random() +
		'&blog=' +
		jetpackSlideshowSettings.blog_id +
		'&subd=' +
		jetpackSlideshowSettings.blog_subdomain +
		'&user_id=' +
		jetpackSlideshowSettings.user_id +
		'&post=' +
		postid +
		'&ref=' +
		encodeURIComponent( document.location );
};

( function () {
	function jetpack_slideshow_init() {
		document.querySelectorAll( '.jetpack-slideshow-noscript' ).forEach( function ( element ) {
			element.remove();
		} );
		document.querySelectorAll( '.jetpack-slideshow' ).forEach( function ( container ) {
			if ( container.dataset.processed === 'true' ) {
				return;
			}

			// Extract data attributes manually
			var transition = container.dataset.trans;
			var autostart = container.dataset.autostart === 'true';
			var gallery = JSON.parse( container.dataset.gallery || '[]' );

			var slideshow = new JetpackSlideshow( container, transition, autostart );
			slideshow.images = gallery;
			slideshow.init();

			container.dataset.processed = 'true';
		} );
	}

	document.addEventListener( 'DOMContentLoaded', jetpack_slideshow_init );
	document.body.addEventListener( 'post-load', jetpack_slideshow_init );
} )();
