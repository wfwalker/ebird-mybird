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

var newPhotos = []

function handleXMP(inXMPPath, tmpEbirdDate, n, tmpDate) {
    let data = fs.readFileSync(inXMPPath)

    let result = XML.parse(data)

    let label = result['rdf:RDF']['rdf:Description']['xmp:Label'];
    let location = result['rdf:RDF']['rdf:Description']['Iptc4xmpCore:Location'];
    let daySightingList = new SightingList(gSightingList.filter(function(s) { return s['Date'] == tmpEbirdDate; }));
    let speciesSightings = daySightingList.filter(s => { return s['Common Name'] == label });
    let photosOriginalNameMatch = photos.filter(p => p['Photo URL'].toLowerCase().indexOf(n.toLowerCase()) > 0);

    if (label == null) {
        label = 'missing'
    }

    let info = {
        label: label,
        location: location,
        date: tmpDate,
        ebirdDate: tmpEbirdDate, 
        sightingsThatDate: daySightingList.length(),
        speciesSightingsThatDate: speciesSightings,
        locations: daySightingList.getUniqueValues('Location'),
        needsAction: true
    }

    if (photosOriginalNameMatch.length > 0) {
        // console.log('already found', n, label, 'in photos.json', tmpEbirdDate, location);
        info.action = 'already found in photos.json'
        info.needsAction = false
        // console.log('already found', n, label, 'in photos.json', tmpEbirdDate, location, photosOriginalNameMatch[0]);
    } else if (label == 'No Label') {
        info.action = 'photo lacks species label'
        // console.log(JSON.stringify(result, null, '  '))
    } else if (speciesSightings.length > 0) {
        let newFilename = tmpDate + '-' + speciesSightings[0]['Scientific Name'].toLowerCase().replace(' ', '-') + '-' + n;

        info.action = 'READY to add to photos.json'

        let samplePhoto = {
            Date: speciesSightings[0].Date,
            Location: speciesSightings[0].Location,
            'Scientific Name': speciesSightings[0]['Scientific Name'],
            'Common Name': speciesSightings[0]['Common Name'],
            'Thumbnail URL': 'https://s3.amazonaws.com/birdwalker/thumb/' + newFilename,
            'Photo URL': 'https://s3.amazonaws.com/birdwalker/photo/' + newFilename,
            County: speciesSightings[0].County,
            'State/Province': speciesSightings[0]['State/Province'],
        };

        newPhotos.push(samplePhoto)

        console.log('\ncp /Users/walker/Photography/flickrUP/' + n + ' /Users/walker/Photography/flickrUP/' + newFilename);
        console.log('\ns3cmd put --acl-public /Users/walker/Photography/flickrUP/' + newFilename + ' s3://birdwalker/photo/ --add-header=Cache-Control:max-age=31536000')
        console.log('\ns3cmd put --acl-public /Users/walker/Photography/flickrUP/' + newFilename + ' s3://birdwalker/thumb/ --add-header=Cache-Control:max-age=31536000')
    } else if (daySightingList.length() > 0) {
        info.action = 'missing species from existing trip ' + tmpEbirdDate
        // console.log(n, 'trip yes but', label, 'no', tmpEbirdDate);
    } else {
        info.action = 'missing trip for date ' + tmpEbirdDate
        // console.log(n, label, 'no trip this date', tmpEbirdDate);
    }

    return info
}

function handleJPEG(inJPEGFilename) {
    let tmpFile = fs.readFileSync('/Users/walker/Photography/flickrUP/' + inJPEGFilename);
    let tmpIPTCdate = iptc(tmpFile).date_created;
    let tmpDate = tmpIPTCdate.substring(0,4) + '-' + tmpIPTCdate.substring(4,6) + '-' + tmpIPTCdate.substring(6,8);
    let tmpEbirdDate = tmpIPTCdate.substring(4,6) + '-' + tmpIPTCdate.substring(6,8) + '-' + tmpIPTCdate.substring(0,4);
    let tmpPath = tmpIPTCdate.substring(0,4) + '/' + tmpDate + '/' + inJPEGFilename.replace('jpg', 'xmp');
    let info = {
        needsAction: true,
        label: 'Missing XMP'
    }

    if (fs.existsSync('/Volumes/Big\ Ethel/Photos/' + tmpPath)) {
        info = handleXMP('/Volumes/Big\ Ethel/Photos/' + tmpPath, tmpEbirdDate, inJPEGFilename, tmpDate);
    } else if (fs.existsSync('/Users/walker/Pictures/' + tmpPath)) {
        info = handleXMP('/Users/walker/Pictures/' + tmpPath, tmpEbirdDate, inJPEGFilename, tmpDate);
    } else if (fs.existsSync('/Volumes/Big Ethel/Photos/' + tmpDate + '/' + inJPEGFilename.replace('jpg','xmp'))) {
        info = handleXMP('/Volumes/Big Ethel/Photos/' + tmpDate + '/' + inJPEGFilename.replace('jpg','xmp'), tmpEbirdDate, inJPEGFilename, tmpDate);
    } else {
        info.action = 'no XMP for ' + tmpPath
        // console.log('no XMP', tmpPath, tmpDate);
        // console.log('GLOB', glob.sync('/Volumes/Big Ethel/Photos/'+tmpIPTCdate.substring(0,4)+'/**/' + inJPEGFilename.replace('jpg','xmp')));
        // console.log('GLOB', glob.sync('/Volumes/Big Ethel/Photos/'+tmpDate+'/**/' + inJPEGFilename.replace('jpg','xmp')));
    }

    info.iptcDate = tmpIPTCdate
    info.name = inJPEGFilename
    info.path = tmpPath

    return info
}

function getStatusForRecentJPEGs() {
    // read all the recent JPEG's in flickrUp
    var allTheFiles = fs.readdirSync('/Users/walker/Photography/flickrUP');
    var theNow = new Date();

    console.log('total flickrUP jpegs', allTheFiles.length);

    var jpegs = allTheFiles.filter((n) => {
        var stats = fs.statSync('/Users/walker/Photography/flickrUP/' + n);
        var daysOld = (theNow - stats.birthtime)/(24*60*60*1000);
        return (! stats.isDirectory()) && (daysOld < 40);
    });

    console.log('recent jpegs', jpegs.length);

    var infoList = jpegs.map(handleJPEG)

    console.log(JSON.stringify(newPhotos, null, '  '))

    console.log(infoList.filter(i => i.needsAction).map(i => i.name.padStart(15) + ' ' + i.label.padStart(20) + ' ' +    i.action))
}

getStatusForRecentJPEGs()

