// TODO: bigger row height if fewer photos
// TODO: this happens too late most of the time

window.onload = function() {
	var galleryCount = $('.mygallery a').length;
	var rowHeight = 200;

	if (galleryCount < 5) {
		rowHeight = 400;
	} else if (galleryCount < 10) {
		rowHeight = 300;
	}

	$('.mygallery').justifiedGallery({
		rowHeight: rowHeight,
		maxRowHeight: rowHeight,
	});
};
