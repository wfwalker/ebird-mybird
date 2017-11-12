console.log('hello, world');

var iptc = require('node-iptc');
var fs = require('fs');
var babyParse = require('babyparse');
var glob = require('glob');
var SightingList = require('./server/scripts/sightinglist.js');
var XML = require('pixl-xml');

var gSightingList = null;

var csvData = fs.readFileSync('server/data/ebird.csv', 'utf8');

var ebird = babyParse.parse(csvData, {
    header: true,
});
console.log('parsed ebird', ebird.data.length);

var jsonData = fs.readFileSync('server/data/photos.json');
var photos = JSON.parse(jsonData);
console.log('parsed photos', photos.length);

gSightingList = new SightingList();
gSightingList.addRows(ebird.data);
gSightingList.setGlobalIDs();

function handleJPEG(inJPEGFilename) {
    let matchAfterLowercasingPhotosJSON = photos.filter(p => p['Filename'].toLowerCase().indexOf(inJPEGFilename) >= 0);

    if (matchAfterLowercasingPhotosJSON.length == 0) {
        console.log('NO MATCH')
        console.log(inJPEGFilename, 'filename on disk')
    }
}

function getStatusForS3TmpJPEGs() {
    // read all the recent JPEG's in flickrUp
    var allTheFiles = fs.readdirSync('s3tmp/photo');
    var theNow = new Date();

    console.log('total s3tmp jpegs', allTheFiles.length);

    var infoList = allTheFiles.map(handleJPEG)
}

getStatusForS3TmpJPEGs()

