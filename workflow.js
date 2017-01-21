console.log('hello, world');

var iptc = require('node-iptc');
var fs = require('fs');
var xml2js = require('xml2js');
var babyParse = require('babyparse');
var glob = require('glob');
var SightingList = require('./app/scripts/sightinglist.js');

var gFiles = {};
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
var allTheFiles = fs.readdirSync('/Users/walker/Photography/flickrUP');
var theNow = new Date();

console.log('total flickrUP jpegs', allTheFiles.length);

var jpegs = allTheFiles.filter((n) => {
    var stats = fs.statSync('/Users/walker/Photography/flickrUP/' + n);
    var daysOld = (theNow - stats.birthtime)/(24*60*60*1000);
    return (daysOld < 90);
});

console.log('recent jpegs', jpegs.length);


function handleXMP(inXMPPath, tmpEbirdDate, n, tmpDate) {
        var parser = new xml2js.Parser();

        fs.readFile(inXMPPath, function(err, data) {
            parser.parseString(data, function (err, result) {
                let label = result['x:xmpmeta']['rdf:RDF'][0]['rdf:Description'][0]['$']['xmp:Label'];
                let location = result['x:xmpmeta']['rdf:RDF'][0]['rdf:Description'][0]['$']['Iptc4xmpCore:Location'];
                let daySightingList = new SightingList(gSightingList.filter(function(s) { return s['Date'] == tmpEbirdDate; }));
                let speciesSightings = daySightingList.filter(s => { return s['Common Name'] == label });
                let photosOriginalNameMatch = photos.filter(p => p['Photo URL'].toLowerCase().indexOf(n.toLowerCase()) > 0);

                gFiles[n].label = label;
                gFiles[n].location = location;
                gFiles[n].date = tmpDate;
                gFiles[n].ebirdDate = tmpEbirdDate;
                gFiles[n].sightingsThatDate = daySightingList.length();
                gFiles[n].speciesSightingsThatDate = speciesSightings;
                gFiles[n].locations = daySightingList.getUniqueValues('Location');

                if (photosOriginalNameMatch.length > 0) {
                    console.log('already found', n, label, 'in photos.json', tmpEbirdDate, location);
                    // console.log('already found', n, label, 'in photos.json', tmpEbirdDate, location, photosOriginalNameMatch[0]);
                } else if (speciesSightings.length > 0) {
                    let newFilename = tmpDate + '-' + speciesSightings[0]['Scientific Name'].toLowerCase().replace(' ', '-') + '-' + n;
                    console.log(n, label, 'sighting', speciesSightings[0].id, location);

                    console.log('cp /Users/walker/Photography/flickrUP/' + n + ' /Users/walker/Photography/flickrUP/' + newFilename);

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
                    console.log(JSON.stringify(samplePhoto, null, '  '));

                    console.log('s3cmd put --acl-public /Users/walker/Photography/flickrUP/' + newFilename + ' s3://birdwalker/photo/ --add-header=Cache-Control:max-age=31536000')
                    console.log('s3cmd put --acl-public /Users/walker/Photography/flickrUP/' + newFilename + ' s3://birdwalker/thumb/ --add-header=Cache-Control:max-age=31536000')
                } else if (daySightingList.length() > 0) {
                    console.log(n, 'trip yes but', label, 'no', tmpEbirdDate);
                } else {
                    console.log(n, label, 'no trip this date', tmpEbirdDate);
                }
            });
        });    
}

var creationDates = jpegs.map((n) => {
    let tmpFile = fs.readFileSync('/Users/walker/Photography/flickrUP/' + n);
    let tmpIPTCdate = iptc(tmpFile).date_created;
    let tmpDate = tmpIPTCdate.substring(0,4) + '-' + tmpIPTCdate.substring(4,6) + '-' + tmpIPTCdate.substring(6,8);
    let tmpEbirdDate = tmpIPTCdate.substring(4,6) + '-' + tmpIPTCdate.substring(6,8) + '-' + tmpIPTCdate.substring(0,4);
    let tmpPath = tmpIPTCdate.substring(0,4) + '/' + tmpDate + '/' + n.replace('jpg', 'xmp');

    gFiles[n] = { date: tmpIPTCdate };

    if (fs.existsSync('/Volumes/Big\ Ethel/Photos/' + tmpPath)) {
        // PARSE XML
        handleXMP('/Volumes/Big\ Ethel/Photos/' + tmpPath, tmpEbirdDate, n, tmpDate);

    } else if (fs.existsSync('/Users/walker/Pictures/' + tmpPath)) {
        // PARSE XML
        handleXMP('/Users/walker/Pictures/' + tmpPath, tmpEbirdDate, n, tmpDate);
    } else if (fs.existsSync('/Volumes/Big Ethel/Photos/' + tmpDate + '/' + n.replace('jpg','xmp'))) {
        // PARSE XML
        console.log('FOUND 3');
        handleXMP('/Volumes/Big Ethel/Photos/' + tmpDate + '/' + n.replace('jpg','xmp'), tmpEbirdDate, n, tmpDate);
    } else {
        console.log('no XMP', tmpPath, tmpDate);
        console.log('GLOB', glob.sync('/Volumes/Big Ethel/Photos/'+tmpIPTCdate.substring(0,4)+'/**/' + n.replace('jpg','xmp')));
        console.log('GLOB', glob.sync('/Volumes/Big Ethel/Photos/'+tmpDate+'/**/' + n.replace('jpg','xmp')));
    }

    return { name: n, path: tmpPath };
});

