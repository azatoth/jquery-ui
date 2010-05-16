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
 */
(function( $, undefined ) {

$.widget( "ui.progressbar", {
	options: {
		value: 0,
		minValue: 0,
		maxValue: 100,
		showFakeMomentum: false,
		fakeMomentumSpeed: 1000
	},

	min: 0,
	max: 100,

	_create: function() {
		this.element
			.addClass( "ui-progressbar ui-widget ui-widget-content ui-corner-all" )
			.attr({
				role: "progressbar",
				"aria-valuemin": this.options.minValue,
				"aria-valuemax": this.options.maxValue,
				"aria-valuenow": this._value()
			});

		this.valueDiv = $( "<div class='ui-progressbar-value ui-widget-header ui-corner-left'></div>" )
			.appendTo( this.element );

		this._refreshValue();
		this._setOption( 'value', this.options.value );
		this._setOption( 'minValue', this.options.minValue );
		this._setOption( 'maxValue', this.options.maxValue );
		this._setOption( 'showFakeMomentum', this.options.showFakeMomentum );
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
				this.element.attr( "aria-valuenow", value );
				this._refreshValue();
				this._trigger( "change" );
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

	_refreshValue: function() {
		var value = this.value();
		this.valueDiv
			.toggleClass( "ui-corner-right", value === this.max )
			.width( value + "%" );
		this.element.attr( "aria-valuenow", value );
	}
});

$.extend( $.ui.progressbar, {
	version: "@VERSION"
});

})( jQuery );
