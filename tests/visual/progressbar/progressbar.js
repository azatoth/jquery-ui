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
});

