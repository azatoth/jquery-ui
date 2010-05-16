$(function() {
	$("#progressbar-normal").progressbar({
		value: 37
	});
	$("#progressbar-min").progressbar({
		minValue: 30,
		value: 37
	});
	$("#progressbar-max").progressbar({
		maxValue: 50,
		value: 37
	});
	$("#progressbar-minmax").progressbar({
		minValue: 30,
		maxValue: 50,
		value: 37
	});
	$("#progressbar-displaycurrent").progressbar({
		value: 37,
		displayCurrentPercent: true
	});

	var animated_cur = animated_min = 0,
	animated_max = 100,
	animated_dir = + .5,
	animated_del = 20;
	var progressbar_displaycurrent_animated = $("#progressbar-displaycurrent-animated");
	progressbar_displaycurrent_animated.progressbar({
		value: 45,
		showFakeMomentum: true,
		displayCurrentPercent: true
	});
	var animate_callback = function() {
		if (!progressbar_displaycurrent_animated.progressbar('option', 'indeterminate')) {
			animated_cur += animated_dir;
			if (animated_cur <= animated_min || animated_cur >= animated_max) {
				animated_cur = 0;
			}
			progressbar_displaycurrent_animated.progressbar('option', 'value', animated_cur);
		}
		setTimeout(animate_callback, animated_del);
	}
	setTimeout(animate_callback, animated_del);
	$('button#progressbar-indeterminal-button').click(function() {
		var current_status = progressbar_displaycurrent_animated.progressbar('option', 'indeterminate');
		if (current_status) {
			progressbar_displaycurrent_animated.progressbar('option', 'indeterminate', false);
			progressbar_displaycurrent_animated.progressbar('option', 'fakeMomentumSpeed', 1000);
		} else {
			progressbar_displaycurrent_animated.progressbar('option', 'indeterminate', true);
			progressbar_displaycurrent_animated.progressbar('option', 'fakeMomentumSpeed', 4000);
		}

	});

	$("#progressbar-indeterminate").progressbar({
		indeterminate: true,
		showFakeMomentum: true
	});

	$('button#progressbar-modal-button').click(function() {
		var animated_cur = animated_min = 0,
		animated_max = 100,
		animated_dir = + .5,
		animated_del = 20;
		var progressbar = $("#progressbar-modal");
		progressbar.progressbar({
			value: 0,
			modal: true,
			showFakeMomentum: true,
			displayCurrentPercent: true
		});
		var animate_callback = function() {
			animated_cur += animated_dir;
			if (animated_cur <= animated_min || animated_cur >= animated_max) {
				progressbar.progressbar("destroy");
				animated_cur = 0;
				return;
			}
			progressbar.progressbar('option', 'value', animated_cur);
			setTimeout(animate_callback, animated_del);
		}
		setTimeout(animate_callback, animated_del);
	});
});

