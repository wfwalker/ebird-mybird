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
	});
});
