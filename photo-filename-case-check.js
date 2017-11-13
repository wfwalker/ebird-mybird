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

// read all the recent JPEG's in flickrUp
var allTheFiles = fs.readdirSync('s3tmp/photo');
var theNow = new Date();

for (let i = 0; i < photos.length; i++) {

    let tmpPhoto = photos[i]

    let fullMatch = allTheFiles.filter(fn => tmpPhoto['Filename'].indexOf(fn) >= 0);
    let fullLowercaseMatch = allTheFiles.filter(fn => tmpPhoto['Filename'].toLowerCase().indexOf(fn.toLowerCase()) >= 0);

    if (fullMatch.length == 0) {
        // console.log(i, tmpPhoto['Filename'], fullLowercaseMatch)
        if (fullLowercaseMatch.length == 1) {
            photos[i].Filename = fullLowercaseMatch[0]
            // console.log('SETTING IT', photos[i].Filename)
        } else {
            // console.log('DANGER DANGER')
        }
    }
}

console.log(JSON.stringify(photos, 2, '  '))

