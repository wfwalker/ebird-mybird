console.log('hello, world');

const iptc = require('node-iptc');
const fs = require('fs');
const XML = require('pixl-xml');
const path = require('path');

/**
 * Recursively searches a directory for files with a specific suffix.
 * @param {string} directoryPath The path to the directory to search.
 * @param {string} suffix The file suffix (e.g., '.txt', '.js').
 * @returns {string[]} An array of absolute paths to matching files.
 */
function findFilesWithSuffix(directoryPath, suffix) {
    let matchingFiles = [];

    try {
        const filesAndDirs = fs.readdirSync(directoryPath);

        for (const item of filesAndDirs) {
            const itemPath = path.join(directoryPath, item);
            const stats = fs.statSync(itemPath);

            if (stats.isDirectory()) {
                // Recursively search subdirectories
                matchingFiles = matchingFiles.concat(findFilesWithSuffix(itemPath, suffix));
            } else if (stats.isFile() && path.extname(itemPath) === suffix) {
                // Add file to the list if it matches the suffix
                matchingFiles.push(itemPath);
            }
        }
    } catch (error) {
        console.error(`Error accessing directory ${directoryPath}: ${error.message}`);
    }

    return matchingFiles;
}

/**
 * Extract the hierarchicalSubject from the XMP and append to the given array
 * @param inXMPPath {string} the path to the XMP file
 * @param inFoundNames {array} the array to accumulate the names we find
 */
function handleXMP(inXMPPath, inFoundNames) {
    try {
        let data = fs.readFileSync(inXMPPath)
        let result = XML.parse(data)

        let speciesTag = result['rdf:RDF']['rdf:Description']['lr:hierarchicalSubject']['rdf:Bag']['rdf:li'];

        if (typeof speciesTag == 'string') {
            inFoundNames.push(speciesTag);
        } else {
            inFoundNames.push(...speciesTag);
        }
    } catch (error) {
        //console.log("uhoh " + error)
    }
}

// Search through the Photos library for XMP files
const targetDirectory = '/Volumes/Batholith/Photos/2024/2024-02-20'; // Replace with your desired directory
const targetSuffix = '.xmp';
const foundFiles = findFilesWithSuffix(targetDirectory, targetSuffix);
console.log(`Files with suffix '${targetSuffix}' in '${targetDirectory}':`);

// Iterate through the XMP files collecting all hierarchicalSubjects
let foundNames = [];
foundFiles.forEach(file => handleXMP(file, foundNames));

// Filter the found names for the pipe character that indicates use of eBird taxonomy
const ebirdNames = foundNames.filter(foundName => foundName.includes("|"));

// Remove duplicates
uniqueEbirdNames = [...new Set(ebirdNames)];

// All done
console.log(uniqueEbirdNames);



