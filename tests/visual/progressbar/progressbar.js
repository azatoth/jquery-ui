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

