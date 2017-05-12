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

function googleMapForLocation(inData, inElement) {
	console.log('googleMapForLocation', inData, inElement);

	var bounds = new google.maps.LatLngBounds();	

	var map = new google.maps.Map(document.getElementById(inElement), {
		zoom: 4,
		styles: mapStyles,
	});

	map.setOptions({
		draggable: false,
		scrollwheel: false,
		maxZoom: 10,
	});

	for (var index = 0; index < inData.rows.length; index++) {
		var coords = {lat: Number.parseFloat(inData.rows[index].Latitude), lng: Number.parseFloat(inData.rows[index].Longitude)};
		var marker = new google.maps.Marker({
			position: coords,
			map: map,
		});		
		bounds.extend(marker.position);
	}

	map.fitBounds(bounds);
}

