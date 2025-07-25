console.log('hello, world');

var iptc = require('node-iptc');
var fs = require('fs');
var papaParse = require('papaparse')
var glob = require('glob');
var SightingList = require('./server/scripts/sightinglist.js');
var XML = require('pixl-xml');

var gSightingList = null;

let fileBytes = fs.readFileSync('server/data/ebird.csv', 'utf8')

if (fileBytes.charCodeAt(0) === 0xFEFF) {
  fileBytes = fileBytes.slice(1);
}

var ebird = papaParse.parse(fileBytes, {
  header: true,
  dynamicTyping: true
})

console.log('parsed ebird', ebird.data.length);

var jsonData = fs.readFileSync('server/data/photos.json');
var photos = JSON.parse(jsonData);
console.log('parsed photos', photos.length);

gSightingList = new SightingList();
gSightingList.addRows(ebird.data);
gSightingList.setGlobalIDs();

var newPhotos = []

var consoleCommands = []

function handleXMP(inXMPPath, inSeperatedIPTCDate, n) {
    let data = fs.readFileSync(inXMPPath)

    let result = XML.parse(data)

    let label = result['rdf:RDF']['rdf:Description']['xmp:Label'];
    let location = result['rdf:RDF']['rdf:Description']['Iptc4xmpCore:Location'];
    let daySightingList = new SightingList(gSightingList.filter(function(s) { return s['Date'] == inSeperatedIPTCDate; }));
    let speciesSightings = daySightingList.filter(s => { return s['Common Name'] == label });
    let photosOriginalNameMatch = photos.filter(p => p['Filename'].toLowerCase().indexOf(n.toLowerCase()) > 0);

    if (label == null) {
        label = 'missing'
    }

    let info = {
        label: label,
        location: location,
        date: inSeperatedIPTCDate,
        ebirdDate: inSeperatedIPTCDate, 
        sightingsThatDate: daySightingList.length(),
        speciesSightingsThatDate: speciesSightings,
        locations: daySightingList.getUniqueValues('Location'),
        needsAction: true
    }

    if (photosOriginalNameMatch.length > 0) {
        // console.log('already found', n, label, 'in photos.json', inSeperatedIPTCDate, location);
        info.action = 'already found in photos.json'
        info.needsAction = false
        // console.log('already found', n, label, 'in photos.json', inSeperatedIPTCDate, location, photosOriginalNameMatch[0]);
    } else if (label == 'No Label') {
        info.action = 'photo lacks species label'
        // console.log(JSON.stringify(result, null, '  '))
    } else if (speciesSightings.length > 0) {
        let newFilename = inSeperatedIPTCDate + '-' + speciesSightings[0]['Scientific Name'].toLowerCase().replace(/ /g, '-') + '-' + n;

        info.action = 'READY to add to photos.json'

        let samplePhoto = {
            Date: speciesSightings[0].Date,
            Location: speciesSightings[0].Location,
            'Scientific Name': speciesSightings[0]['Scientific Name'],
            'Common Name': speciesSightings[0]['Common Name'],
            Filename: newFilename,
            County: speciesSightings[0].County,
            'State/Province': speciesSightings[0]['State/Province'],
        };

        newPhotos.push(samplePhoto)

        consoleCommands.push('cp /Users/walker/Photography/flickrUP/' + n + ' /Users/walker/Photography/flickrUP/' + newFilename);
        consoleCommands.push('s3cmd put --acl-public /Users/walker/Photography/flickrUP/' + newFilename + ' s3://birdwalker/photo/ --add-header=Cache-Control:max-age=31536000')
        consoleCommands.push('s3cmd put --acl-public /Users/walker/Photography/flickrUP/' + newFilename + ' s3://birdwalker/thumb/ --add-header=Cache-Control:max-age=31536000')
    } else if (daySightingList.length() > 0) {
        info.action = 'missing species from existing http://www.birdwalker.com/trip/' + inSeperatedIPTCDate
        // console.log(n, 'trip yes but', label, 'no', inSeperatedIPTCDate);
    } else {
        info.action = 'missing trip for date ' + inSeperatedIPTCDate
        // console.log(n, label, 'no trip this date', inSeperatedIPTCDate);
    }

    return info
}

function handleJPEG(inJPEGFilename) {
    let jpegFilePath = '/Users/walker/Photography/flickrUP/' + inJPEGFilename
    let tmpFile = fs.readFileSync(jpegFilePath);
    let info = {
        needsAction: true,
        label: 'No IPTC Date',
        name: inJPEGFilename
    }

    // IPTC date is year month day no seperators '20151223'
    let tmpIPTCdate = iptc(tmpFile).date_created;

    if (tmpIPTCdate == undefined) {
        console.log('No IPTC date for ' + inJPEGFilename)
        return info
    }

    // seperated IPTC date year-month-day like '2015-12-23'    
    let tmpSeperatedIPTCDate = tmpIPTCdate.substring(0,4) + '-' + tmpIPTCdate.substring(4,6) + '-' + tmpIPTCdate.substring(6,8);

    // seperated month-day-year like '12-23-2015' as appears in CSV data dump from eBird
    // let tmpEbirdDate = tmpIPTCdate.substring(4,6) + '-' + tmpIPTCdate.substring(6,8) + '-' + tmpIPTCdate.substring(0,4);

    let yearDateFilenameDotXMP = tmpIPTCdate.substring(0,4) + '/' + tmpSeperatedIPTCDate + '/' + inJPEGFilename.replace('jpg', 'xmp');

    let path1 = '/Volumes/Batholith/Photos/' + yearDateFilenameDotXMP
    let path2 = '/Users/walker/Pictures/' + yearDateFilenameDotXMP
    let path3 = '/Volumes/Batholith/Photos/' + tmpSeperatedIPTCDate + '/' + inJPEGFilename.replace('jpg','xmp')
    let path4 = '/Volumes/Batholith/Photos/photos-' + tmpSeperatedIPTCDate + '/' + inJPEGFilename.replace('jpg','xmp')
    let path5 = '/Volumes/Batholith/Photos/photos-' + tmpSeperatedIPTCDate + 'B/' + inJPEGFilename.replace('jpg','xmp')

    // TODO: need to restore searching for Big\ Ethel/Photos/photos-tmpSeperatedIPTCDate

    if (fs.existsSync(path1)) {
        info = handleXMP(path1, tmpSeperatedIPTCDate, inJPEGFilename);
    } else if (fs.existsSync(path2)) {
        info = handleXMP(path2, tmpSeperatedIPTCDate, inJPEGFilename);
    } else if (fs.existsSync(path3)) {
        info = handleXMP(path3, tmpSeperatedIPTCDate, inJPEGFilename);
    } else if (fs.existsSync(path4)) {
        info = handleXMP(path4, tmpSeperatedIPTCDate, inJPEGFilename);
    } else if (fs.existsSync(path5)) {
        info = handleXMP(path5, tmpSeperatedIPTCDate, inJPEGFilename);
    } else {
        info.action = 'no XMP for open ' + '/Users/walker/Photography/flickrUP/' + inJPEGFilename
        console.log('\n\n')
        console.log('no XMP open    /Users/walker/Photography/flickrUP/' + inJPEGFilename)
        console.log(path1)
        console.log(path2)
        console.log(path3)
        console.log(path4)
        // console.log('GLOB', glob.sync('/Volumes/Big Ethel/Photos/**/' + inJPEGFilename.replace('jpg','xmp')));
        // console.log('GLOB', glob.sync('/Users/walker/Pictures/**/' + inJPEGFilename.replace('jpg','xmp')));
    }

    info.iptcDate = tmpIPTCdate
    info.name = inJPEGFilename
    info.path = yearDateFilenameDotXMP

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
        return (! stats.isDirectory()) && (daysOld < 120);
    });

    console.log('recent jpegs', jpegs.length);

    var infoList = jpegs.map(handleJPEG)

    console.log('\nDO THESE COMMANDS\n')
    consoleCommands.forEach(cmd => { console.log(cmd) })

    console.log('\nADD THESE TO photos.json\n')
    console.log(JSON.stringify(newPhotos, null, '  '))

    console.log('\nSUMMARY\n')
    console.log(infoList.filter(i => i.needsAction).map(i => i.name.padStart(15) + ' ' + i.label.padStart(20) + ' ' +    i.action))
}

getStatusForRecentJPEGs()

