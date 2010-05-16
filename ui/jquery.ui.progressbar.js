/*
 * jQuery UI Progressbar @VERSION
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Progressbar
 *
 * Depends:
 *   jquery.ui.core.js
 *   jquery.ui.widget.js
 *   jquery.ui.position.js
 */
(function( $, undefined ) {

$.widget( "ui.progressbar", {
	options: {
		value: 0,
		animateResize: false,
		minValue: 0,
		maxValue: 100,
		showFakeMomentum: false,
		fakeMomentumSpeed: 1000,
		displayCurrentPercent: false,
		barResolution: 3,
		displayResolution: 0,
		indeterminate: false
	},

	min: 0,
	max: 100,

	_create: function() {
		this.element
		.addClass( "ui-progressbar ui-widget ui-widget-content ui-corner-all" )
		.attr({	role: "progressbar" });
		if( !this.options.indeterminate ) {
			this.element.attr(
				{
					"aria-valuemin": this.options.minValue,
					"aria-valuemax": this.options.maxValue,
					"aria-valuenow": this._value()
				}
			);
		};



		this.valueDiv = $( "<div/>", {
				'class': 'ui-progressbar-value ui-widget-header ui-corner-left'
			}
		)
		.appendTo( this.element );
		this.percentageSpan = $( "<span/>", { 'class': 'ui-progressbar-percent' } )
		.appendTo( this.element );
		this._refreshValue();



		this._setOption( 'value', this.options.value );
		this._setOption( 'minValue', this.options.minValue );
		this._setOption( 'maxValue', this.options.maxValue );
		this._setOption( 'showFakeMomentum', this.options.showFakeMomentum );
		this._setOption( 'displayCurrentPercent', this.options.displayCurrentPercent );
		this._setOption( 'barResolution', this.options.barResolution );
		this._setOption( 'displayResolution', this.options.displayResolution );
		this._setOption( 'indeterminate', this.options.indeterminate );
	},

	destroy: function() {
		this.element
			.removeClass( "ui-progressbar ui-widget ui-widget-content ui-corner-all" )
			.removeAttr( "role" )
			.removeAttr( "aria-valuemin" )
			.removeAttr( "aria-valuemax" )
			.removeAttr( "aria-valuenow" );

		this.valueDiv.remove();

		$.Widget.prototype.destroy.apply( this, arguments );
	},

	value: function( newValue ) {
		if ( newValue === undefined ) {
			return this._value();
		}

		this._setOption( "value", newValue );
		return this;
	},

	_setOption: function( key, value ) {
		switch ( key ) {
			case "value":
				this.options.value = value;
				if ( !this.options.indeterminate ) {
					this.element.attr( "aria-valuenow", value );
					this._refreshValue();
					this._trigger( "change" );
				}
				break;
			case "indeterminate":
				var oldvalue = this.options.indeterminate;
				this.options.indeterminate = value;
				if( value ) {
					this.element.removeAttr( "aria-valuemin" )
					.removeAttr( "aria-valuemax" )
					.removeAttr( "aria-valuenow" );
					this.valueDiv.addClass("ui-corner-right");
				} else {
					this.element.attr(
						{
							"aria-valuemin": this.options.minValue,
							"aria-valuemax": this.options.maxValue,
							"aria-valuenow": this._value()
						}
					);
					this.valueDiv.removeClass( 'ui-progress-indeterminate-high').css('opacity', 1);
					if( !this._done() ) {
						this.valueDiv.removeClass("ui-corner-right");
					}
				};
				if( oldvalue != value ) {
					this._refreshValue();
					this._trigger( "change" );
				}
				break;
			case "minValue":
				this.options.minValue = value;
				if ( !this.options.indeterminate ) {
					this.element.attr( "aria-valuemin", this.options.minValue );
					this._refreshValue();
					this._trigger( "change" );
				}
				break;
			case "maxValue":
				this.options.maxValue = value;
				if ( !this.options.indeterminate ) {
					this.element.attr( "aria-valuemax", this.options.maxValue );
					this._refreshValue();
					this._trigger( "change" );
				}
				break;
			case "displayCurrentPercent":
				if( value ) {
					this.percentageSpan.show();
				} else {
					this.percentageSpan.hide();
				}
				break;
			case "showFakeMomentum":
				if( value ) {
					this._displayFakeMomentum();
				} else {
					this._hideFakeMomentum();
				}
				break;
		}

		$.Widget.prototype._setOption.apply( this, arguments );
	},

	_displayFakeMomentum: function() {
		var self = this;
		if( self.fakeMomentumDiv ) {
			return;
		}
		self.fakeMomentumDiv = $('<div/>', { 'class': 'ui-progressbar-fake-momentum ui-corner-left'}).appendTo( self.valueDiv );
		self._showFakeMomentumCallback = function() {
			self.fakeMomentumDiv.css({'background-position': '0 0'})
			.animate(
				{ 
					'background-position': "-25px 0"
				},
				{
					duration: self.options.fakeMomentumSpeed,
					easing: 'linear',
					complete: function() {
						if( self.fakeMomentumDiv ) {
							self._showFakeMomentumCallback();
						}
					}
				}
			);
		};
		self._showFakeMomentumCallback();
	},
	_hideFakeMomentum: function() {
		var self = this;
		if( !self.fakeMomentumDiv ) {
			return;
		}
		self.fakeMomentumDiv.remove();
	},
	_value: function() {
		var val = this.options.value;
		// normalize invalid value
		if ( typeof val !== "number" ) {
			val = parseInt(val);
		}
		return Math.min( this.options.maxValue, Math.max( this.options.minValue, val ) );
	},
	_done: function() {
		return  this.value() === this.options.maxValue;
	},

	_percentageValue: function() {
		return (
			( this.value() - this.options.minValue ) /
			( this.options.maxValue - this.options.minValue ) *
			100
		);
	},

	_refreshValue: function() {
		var self = this;
		if( self.options.indeterminate ) {
			self._indeterminateHigh  = ! self._indeterminateHigh;
			self.valueDiv.toggleClass( 'ui-progress-indeterminate-high', self._indeterminateHigh );
			self.valueDiv.animate(
				{
					'opacity':  self._indeterminateHigh ? .5 : 1,
				},
				{
					'duration': 500,
					'easing': 'linear',
					'complete': function(){
						if( !self.options.indeterminate ) {
							self.valueDiv.css('opacity', 1);
						}
						self._refreshValue();

					}
				}
			);
			return;
		}
		var fraction = self._percentageValue();
		self.valueDiv[ self._done() ? "addClass" : "removeClass"]( "ui-corner-right" );
		if( self.options.animateResize ) {
			self.valueDiv.animate({'width': fraction.toFixed(self.options.barResolution) + '%'}, 'slow');
		} else {
			self.valueDiv.width( fraction.toFixed(self.options.barResolution)  + "%" );
		}
		self.element.attr( "aria-valuenow", self.value() );
		self.percentageSpan.html( fraction.toFixed(self.options.displayResolution) + "%" );
		self.percentageSpan.position({
				my: "center",
				at: "center",
				of: self.element,
				collision: 'none'
			});
		var bar_width = self.valueDiv.outerWidth(true);
		var bar_offset = self.valueDiv.offset();
		var percent_width = self.percentageSpan.outerWidth(true);

		var percent_marg = percent_width - self.percentageSpan.innerWidth()/2;

		var percent_offset = self.percentageSpan.offset();
		var percent_midpoint = percent_width/2 + percent_offset.left;
		var percent_leftpoint = percent_offset.left;
		var percent_rightpoint = percent_offset.left + percent_width;

		var bar_rightpoint = bar_width + bar_offset.left;

		if( percent_leftpoint <= bar_rightpoint + percent_marg && percent_rightpoint >= bar_rightpoint - percent_marg ) {
			if( bar_rightpoint < percent_midpoint ) {
				percent_offset.left = bar_rightpoint + percent_marg;
			} else {
				percent_offset.left = bar_rightpoint - percent_marg - percent_width;
			}

		}
			percent_offset.left = parseInt( percent_offset.left );
			percent_offset.top = parseInt( percent_offset.top );
			self.percentageSpan.offset( percent_offset );

		if( percent_offset.left > bar_rightpoint ) {
			self.percentageSpan.removeClass("ui-progressbar-percent-above");
		} else {
			self.percentageSpan.addClass("ui-progressbar-percent-above");
		}
	}
});

$.extend( $.ui.progressbar, {
	version: "@VERSION"
});

})( jQuery );
