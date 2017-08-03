var fs = require('fs');
var iptc = require('node-iptc');
var XML = require('pixl-xml');
var SightingList = require('./sightinglist.js');
var glob = require('glob');

var gSightingList = null
var gPhotos = null

class JPEGUtils {
    static setAllSightings(inAllSightings) {
        gSightingList = inAllSightings
    }
    static setAllPhotos(inAllPhotos) {
        gPhotos = inAllPhotos
    }

    static handleXMP(inXMPPath, tmpEbirdDate, n, tmpDate) {
        console.log('handleXMP', inXMPPath)
        let data = fs.readFileSync(inXMPPath)

        let result = XML.parse(data)

        let label = result['rdf:RDF']['rdf:Description']['xmp:Label'];
        let location = result['rdf:RDF']['rdf:Description']['Iptc4xmpCore:Location'];
        let daySightingList = new SightingList(gSightingList.filter(function(s) { return s['Date'] == tmpEbirdDate; }));
        let speciesSightings = daySightingList.filter(s => { return s['Common Name'] == label });
        let photosOriginalNameMatch = gPhotos.filter(p => p['Photo URL'].toLowerCase().indexOf(n.toLowerCase()) > 0);

        let info = {
            label: label,
            location: location,
            date: tmpDate,
            ebirdDate: tmpEbirdDate, 
            sightingsThatDate: daySightingList.length(),
            speciesSightingsThatDate: speciesSightings,
            locations: daySightingList.getUniqueValues('Location')
        }

        if (photosOriginalNameMatch.length > 0) {
            console.log('already found', n, label, 'in photos.json', tmpEbirdDate, location);
            info.action = 'already found in photos.json'
            console.log('already found', n, label, 'in photos.json', tmpEbirdDate, location, photosOriginalNameMatch[0]);
        } else if (speciesSightings.length > 0) {
            let newFilename = tmpDate + '-' + speciesSightings[0]['Scientific Name'].toLowerCase().replace(' ', '-') + '-' + n;
            console.log(n, label, 'sighting', speciesSightings[0].id, location);

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
            console.log('\n\n\n');
            console.log(JSON.stringify(samplePhoto, null, '  '));
            console.log('cp /Users/walker/Photography/flickrUP/' + n + ' /Users/walker/Photography/flickrUP/' + newFilename);
            console.log('s3cmd put --acl-public /Users/walker/Photography/flickrUP/' + newFilename + ' s3://birdwalker/photo/ --add-header=Cache-Control:max-age=31536000')
            console.log('s3cmd put --acl-public /Users/walker/Photography/flickrUP/' + newFilename + ' s3://birdwalker/thumb/ --add-header=Cache-Control:max-age=31536000')
        } else if (daySightingList.length() > 0) {
            info.action = 'missing species ' + label + ' from existing trip ' + tmpEbirdDate
            console.log(n, 'trip yes but', label, 'no', tmpEbirdDate);
        } else {
            info.action = 'missing trip for date ' + tmpEbirdDate
            console.log(n, label, 'no trip this date', tmpEbirdDate);
        }

        return info
    }

    static handleJPEG(inJPEGFilename) {
        console.log('handleJPEG', inJPEGFilename)
        let tmpFile = fs.readFileSync('/Users/walker/Photography/flickrUP/' + inJPEGFilename);
        let tmpIPTCdate = iptc(tmpFile).date_created;
        let tmpDate = tmpIPTCdate.substring(0,4) + '-' + tmpIPTCdate.substring(4,6) + '-' + tmpIPTCdate.substring(6,8);
        let tmpEbirdDate = tmpIPTCdate.substring(4,6) + '-' + tmpIPTCdate.substring(6,8) + '-' + tmpIPTCdate.substring(0,4);
        let tmpPath = tmpIPTCdate.substring(0,4) + '/' + tmpDate + '/' + inJPEGFilename.replace('jpg', 'xmp');
        let info = {}

        if (fs.existsSync('/Volumes/Big\ Ethel/Photos/' + tmpPath)) {
            info = JPEGUtils.handleXMP('/Volumes/Big\ Ethel/Photos/' + tmpPath, tmpEbirdDate, inJPEGFilename, tmpDate);
        } else if (fs.existsSync('/Users/walker/Pictures/' + tmpPath)) {
            info = JPEGUtils.handleXMP('/Users/walker/Pictures/' + tmpPath, tmpEbirdDate, inJPEGFilename, tmpDate);
        } else if (fs.existsSync('/Volumes/Big Ethel/Photos/' + tmpDate + '/' + inJPEGFilename.replace('jpg','xmp'))) {
            info = JPEGUtils.handleXMP('/Volumes/Big Ethel/Photos/' + tmpDate + '/' + inJPEGFilename.replace('jpg','xmp'), tmpEbirdDate, inJPEGFilename, tmpDate);
        } else {
            info.action = 'no XMP for ' + tmpPath
            console.log('no XMP', tmpPath, tmpDate);
            console.log('GLOB', glob.sync('/Volumes/Big Ethel/Photos/'+tmpIPTCdate.substring(0,4)+'/**/' + inJPEGFilename.replace('jpg','xmp')));
            console.log('GLOB', glob.sync('/Volumes/Big Ethel/Photos/'+tmpDate+'/**/' + inJPEGFilename.replace('jpg','xmp')));
        }

        info.iptcDate = tmpIPTCdate
        info.name = inJPEGFilename
        info.path = tmpPath

        return info
    }

    static getStatusForRecentJPEGs() {
        // read all the recent JPEG's in flickrUp
        var allTheFiles = fs.readdirSync('/Users/walker/Photography/flickrUP');
        var theNow = new Date();

        console.log('total flickrUP jpegs', allTheFiles.length);

        var jpegs = allTheFiles.filter((n) => {
            var stats = fs.statSync('/Users/walker/Photography/flickrUP/' + n);
            var daysOld = (theNow - stats.birthtime)/(24*60*60*1000);
            return (daysOld < 20);
        });

        console.log('recent jpegs', jpegs.length);

        var infoList = jpegs.map(JPEGUtils.handleJPEG)

        console.log('infoList', infoList.map(i => [i.name, i.action]))

        return infoList
    }
}

if (typeof module !== 'undefined') {
    module.exports = JPEGUtils
}


