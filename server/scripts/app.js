// TODO: bigger row height if fewer photos
// TODO: this happens too late most of the time

$(document).ready(function() {
	var galleryCount = $('.mygallery a').length;
	var rowHeight = 200;

	if (galleryCount < 5) {
		rowHeight = 350;
	} else if (galleryCount < 10) {
		rowHeight = 300;
	}

	$('.mygallery').justifiedGallery({
		rowHeight: rowHeight,
		maxRowHeight: rowHeight,
	})

	$('input').attr('autocomplete', 'off')

	$('.typeahead').typeahead({
		source: function(thing, process) {
				console.log('thing', thing)
				// process(['albatross', 'corncrake', 'drongo', 'zebra'])

				$.ajax({
					url: '/searchdata?searchtext=' + thing
				}).done(function(data) {
					console.log('DATA', 'strings', data.length)
					process(data)
				})
			},
	    updater: function(item) {
		        this.$element[0].value = item;
		        this.$element[0].form.submit();
		        return item;
		    },
		minLength: 3,
		items: 'all'
	})
});
